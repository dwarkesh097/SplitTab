import {createSlice} from '@reduxjs/toolkit';

interface AnalyticsState {
  // Add any analytics state if needed
}

const initialState: AnalyticsState = {};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
});

export default analyticsSlice.reducer;