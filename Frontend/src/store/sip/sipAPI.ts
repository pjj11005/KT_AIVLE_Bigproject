import { createAsyncThunk } from '@reduxjs/toolkit';
import JsSIP from 'jssip';
import { connect, disconnect } from './sipSlice';
import {
  acceptCall,
  endCall,
  receiveCall,
  setCurrentSession,
} from '../call/callSlice';
import { store } from '../index';
import { AudioProcessor } from '../../utils/audioProcessor';
import { RTCSession } from 'jssip/lib/RTCSession';
import { AudioPlayer } from '../../utils/audioPlayer';

const SIP_SERVER = 'wss://webrtc.my-lab.blog:8089/ws';
const SIP_USER = 'User3';
const SIP_PASSWORD = '1234';
const audioPlayer = new AudioPlayer();

let ua: JsSIP.UA | null = null;
let currentSession: RTCSession | null = null;
let senderAudioProcessor: AudioProcessor | null = null;
let receiverAudioProcessor: AudioProcessor | null = null;

export const connectToSipServer = createAsyncThunk(
  'sip/connectToSipServer',
  async (_, { dispatch }) => {
    const socket = new JsSIP.WebSocketInterface(SIP_SERVER);
    const configuration = {
      sockets: [socket],
      uri: `sip:${SIP_USER}@webrtc.my-lab.blog`,
      password: SIP_PASSWORD,
    };

    ua = new JsSIP.UA(configuration);

    ua.on('connecting', () => console.log('Connecting to SIP server...'));
    ua.on('connected', () => {
      console.log('Connected to SIP server');
      dispatch(connect());
    });
    ua.on('disconnected', () => {
      console.log('Disconnected from SIP server');
      cleanupSession();
    });
    ua.on('registered', () => console.log('Registered with SIP server'));
    ua.on('unregistered', () => console.log('Unregistered from SIP server'));
    ua.on('registrationFailed', (cause) =>
      console.log('Registration failed:', cause),
    );

    ua.on('newRTCSession', async (data: any) => {
      console.log('New RTC Session');
      const { originator, session } = data;

      if (currentSession) {
        console.log('Terminating existing session');
        cleanupSession();
      }

      currentSession = session;
      dispatch(setCurrentSession(session));

      console.log('originator: ', originator);
      console.log('session: ', session);

      session.on('sdp', (e: any) => {
        console.log('SDP:', e.sdp);
      });

      session.on('icecandidate', (e: any) => {
        console.log('ICE candidate:', e.candidate);
      });

      if (session.direction === 'incoming' && originator !== 'local') {
        console.log('Incoming call');
        console.log('remote name: ', session.remote_identity.display_name);

        store.dispatch(
          receiveCall({
            caller: session.remote_identity.display_name || 'Unknown',
            session,
          }),
        );

        session.on('accepted', () => {
          console.log('Call accepted');
          dispatch(acceptCall());
        });
      }

      session.on('confirmed', () => {
        console.log('Call confirmed');
        setupAudioProcessing(session);
        logStreamInfo(session);
      });

      session.on('ended', () => {
        console.log('Call ended');
        store.dispatch(endCall());
        cleanupSession();
      });

      session.on('failed', (e: any) => {
        console.log('Call failed:', e);
        store.dispatch(endCall());
        cleanupSession();
      });
    });

    ua.start();
  },
);

export function getRemoteUser() {
  if (currentSession) {
    return currentSession?.remote_identity?.uri?.user;
  } else {
    return null;
  }
}

export const disconnectFromSipServer = createAsyncThunk(
  'sip/disconnectFromSipServer',
  async (_, { dispatch }) => {
    cleanupSession();
    if (ua) {
      ua.stop();
      ua = null;
      dispatch(disconnect());
      console.log('Disconnected from SIP server');
    }
  },
);

function cleanupSession() {
  console.log('Cleaning up session');
  if (currentSession) {
    if (
      currentSession.isEnded() ||
      currentSession.status === RTCSession.C.STATUS_TERMINATED
    ) {
      console.log('Session already ended, skipping termination');
    } else {
      try {
        currentSession.terminate();
      } catch (error) {
        console.error('Error terminating session:', error);
      }
    }
    currentSession = null;
    store.dispatch(setCurrentSession(null));
  }

  if (senderAudioProcessor) {
    senderAudioProcessor.stop();
    senderAudioProcessor = null;
  }

  if (receiverAudioProcessor) {
    receiverAudioProcessor.stop();
    receiverAudioProcessor = null;
  }
}

function setupAudioProcessing(session: RTCSession) {
  const localStream = new MediaStream(
    session.connection
      .getSenders()
      .map((sender) => sender.track)
      .filter((track) => track !== null) as MediaStreamTrack[],
  );

  const remoteStream = new MediaStream();

  session.connection.getReceivers().forEach((receiver) => {
    if (receiver.track) {
      remoteStream.addTrack(receiver.track);
    }
  });

  console.log('Local tracks:', localStream.getTracks());
  console.log('Remote tracks:', remoteStream.getTracks());

  const customerId = generateUniqueId();
  const agentId = store.getState().auth.user?.id || 'unknown';
  const phone = session.remote_identity.uri.user || '010-0000-0000';

  if (localStream.getTracks().length > 0) {
    receiverAudioProcessor = new AudioProcessor(
      'receiver',
      (result) => {
        console.log('Local audio processing result:', result);
      },
      customerId,
      agentId,
      phone,
    );
    receiverAudioProcessor.start(localStream);
  } else {
    console.warn('No local tracks found');
  }

  if (remoteStream.getTracks().length > 0) {
    senderAudioProcessor = new AudioProcessor(
      'sender',
      (result) => {
        console.log('Remote audio processing result:', result);
        if (result.audio_file_path) {
          audioPlayer
            .playAudio(result.audio_file_path)
            .catch((error) => console.error('Error playing audio:', error));
        }
      },
      customerId,
      agentId,
      phone,
    );
    senderAudioProcessor.start(remoteStream);
  }

  const remoteAudio = document.getElementById(
    'remoteAudio',
  ) as HTMLAudioElement;
  if (remoteAudio) {
    remoteAudio.srcObject = remoteStream;
    remoteAudio.muted = true;
    remoteAudio
      .play()
      .catch((error) => console.error('Error playing remote audio:', error));
  }

  remoteStream.getAudioTracks().forEach((track) => {
    console.log(
      'Remote track enabled:',
      track.enabled,
      'muted:',
      track.muted,
      'readyState:',
      track.readyState,
    );
  });

  localStream.getAudioTracks().forEach((track) => {
    console.log(
      'Local track enabled:',
      track.enabled,
      'muted:',
      track.muted,
      'readyState:',
      track.readyState,
    );
  });
  console.log('Connection state:', session.connection.connectionState);
  console.log('ICE connection state:', session.connection.iceConnectionState);
  console.log('Signaling state:', session.connection.signalingState);

  setInterval(() => logStreamInfo(session), 600000);
}

function logStreamInfo(session: RTCSession) {
  if (session.connection) {
    console.log('All Receivers:', session.connection.getReceivers());

    session.connection.getReceivers().forEach((receiver, index) => {
      console.log(`Receiver ${index}:`, receiver);
      console.log(`Receiver ${index} track:`, receiver.track);
      if (receiver.track) {
        console.log(`Receiver ${index} track state:`, {
          enabled: receiver.track.enabled,
          muted: receiver.track.muted,
          readyState: receiver.track.readyState,
        });
      }
    });
  } else {
    console.log('No active connection in the session');
  }
}

function generateUniqueId(): string {
  const dateStr = new Date().toISOString().replace(/[-T:.Z]/g, '');
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${dateStr}-${randomStr}`;
}
