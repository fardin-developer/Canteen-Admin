import { configureStore } from '@reduxjs/toolkit';
import authenticationSlice from './slices/authenticationSlice.jsx'
import test from './slices/test.js';

export const store = configureStore({
  reducer: {
     authentication: authenticationSlice,
     test: test,
     
  },
})