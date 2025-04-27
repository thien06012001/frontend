// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'), // Load from localStorage if available
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Sync with localStorage
    },
    logout: state => {
      state.user = null;
      localStorage.removeItem('user'); // Remove from localStorage on logout
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
