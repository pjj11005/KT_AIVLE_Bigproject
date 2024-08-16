import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import sipReducer from './sip/sipSlice';
import callReducer from './call/callSlice';
import agentReducer from './agent/agentSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
    call: callReducer,
    sip: sipReducer,
    agent: agentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export { store };
