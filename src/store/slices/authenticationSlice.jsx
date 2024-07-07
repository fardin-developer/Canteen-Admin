import { createSlice } from '@reduxjs/toolkit';
import AuthService from '../../services/authservices';

const initialState = {
  isAuthenticated: false,
  user: null,
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,

  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;