import { createSlice } from '@reduxjs/toolkit';

interface SipState {
  connected: boolean;
}

const initialState: SipState = {
  connected: false,
};

const sipSlice = createSlice({
  name: 'sip',
  initialState,
  reducers: {
    connect: (state) => {
      state.connected = true;
    },
    disconnect: (state) => {
      state.connected = false;
    },
  },
});

export const { connect, disconnect } = sipSlice.actions;
export default sipSlice.reducer;
