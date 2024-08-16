import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RTCSession } from 'jssip/lib/RTCSession';
import { RootState } from '../index';

interface CallState {
  incomingCall: string | null;
  activeCall: boolean;
  currentSession: RTCSession | null;
}

const initialState: CallState = {
  incomingCall: null,
  activeCall: false,
  currentSession: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    receiveCall: (
      state,
      action: PayloadAction<{ caller: string; session: RTCSession }>,
    ) => {
      state.incomingCall = action.payload.caller;
      state.currentSession = action.payload.session;
    },
    acceptCall: (state) => {
      state.activeCall = true;
      state.incomingCall = null;
    },
    transferCall: (state) => {
      state.incomingCall = null;
      state.currentSession = null;
    },
    endCall: (state) => {
      state.activeCall = false;
      state.currentSession = null;
    },
    setCurrentSession: (state, action: PayloadAction<RTCSession | null>) => {
      state.currentSession = action.payload;
    },
  },
});

export const {
  receiveCall,
  acceptCall,
  transferCall,
  endCall,
  setCurrentSession,
} = callSlice.actions;
export const selectIncomingCall = (state: RootState) => state.call.incomingCall;
export const selectActiveCall = (state: RootState) => state.call.activeCall;
export const selectCurrentSession = (state: RootState) =>
  state.call.currentSession;
export default callSlice.reducer;
