import IncomingCallModal from '../IncommingCallModal';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { RTCSession } from 'jssip/lib/RTCSession';
import { acceptCall, endCall } from '../../store/call/callSlice';
import { getLocalStream } from '../../utils/utils';
import { AudioProcessor } from '../../utils/audioProcessor';
import { getToken } from '../../utils/auth';
import { getData } from '../../api';
import { setUser } from '../../store/auth/authSlice';
import { User } from '../../types';

export const fetchUserInfo = async (token: string) => {
  try {
    const response = await getData('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user info:', error);
    } else {
      console.error('Error fetchUserInfo');
    }
    throw error;
  }
};

export const PrivateRouter: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [customerId, setCustomerId] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const incomingCall = useSelector(
    (state: RootState) => state.call.incomingCall,
  );
  const currentSession: RTCSession | null = useSelector(
    (state: RootState) => state.call.currentSession,
  );
  const agentStatus = useSelector((state: RootState) => state.agent.status);
  const senderAudioProcessorRef = useRef<AudioProcessor | null>(null);
  const receiverAudioProcessorRef = useRef<AudioProcessor | null>(null);

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const [clientPhone, setClientPhone] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        navigate('/', { replace: true, state: { from: location } });
      } else if (!user) {
        try {
          const userInfo = await fetchUserInfo(token);
          dispatch(setUser(userInfo as User));
        } catch (error) {
          console.error('Failed to fetch user info', error);
          navigate('/', {
            replace: true,
            state: { from: location.pathname + location.search },
          });
        }
      }
    };
    checkAuth();
  }, []);

  const cleanupAudioProcessors = useCallback(() => {
    if (senderAudioProcessorRef.current) {
      senderAudioProcessorRef.current.stop();
      senderAudioProcessorRef.current = null;
    }
    if (receiverAudioProcessorRef.current) {
      receiverAudioProcessorRef.current.stop();
      receiverAudioProcessorRef.current = null;
    }
  }, []);

  const handleAccept = async () => {
    if (currentSession) {
      try {
        const localStream = await getLocalStream();
        await currentSession.answer({
          mediaConstraints: { audio: true, video: false },
        });

        const phone = currentSession.remote_identity.uri.user;
        setClientPhone(phone);

        dispatch(acceptCall());
        navigate('/call');
      } catch (error) {
        console.error('Error accepting call:', error);
      }
    }
  };

  useEffect(() => {
    return cleanupAudioProcessors;
  }, [cleanupAudioProcessors]);

  const handleTransfer = () => {
    console.log('PrivateRouter handleTransfer');
    // 통화 전환 로직 구현
  };

  return (
    <>
      {currentSession && agentStatus === 'working' && incomingCall && (
        <IncomingCallModal
          caller={incomingCall}
          onAccept={handleAccept}
          onTransfer={handleTransfer}
        />
      )}

      <Outlet />
      <audio ref={localAudioRef} muted autoPlay style={{ display: 'none' }} />
      <audio
        ref={remoteAudioRef}
        id="remoteAudio"
        autoPlay
        style={{ display: 'none' }}
      />
    </>
  );
};
