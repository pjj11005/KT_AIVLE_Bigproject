import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../index';
import { connectToSipServer, disconnectFromSipServer } from '../sip/sipAPI';

interface AgentState {
  status: 'off' | 'working' | 'resting';
}

const initialState: AgentState = {
  status: 'off',
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<'off' | 'working' | 'resting'>,
    ) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = agentSlice.actions;
export const selectAgentStatus = (state: RootState) => state.agent.status;

export const changeAgentStatus =
  (status: 'off' | 'working' | 'resting') => async (dispatch: AppDispatch) => {
    dispatch(setStatus(status));
    if (status === 'working') {
      await dispatch(connectToSipServer());
    } else {
      await dispatch(disconnectFromSipServer());
    }
  };

export default agentSlice.reducer;
