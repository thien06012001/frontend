// src/hooks/redux/slices/user.slice.ts

/**
 * User slice
 *
 * Manages authentication state for the current user.
 * - Loads initial user state from localStorage (if present).
 * - Provides actions to set or clear the user, and keeps localStorage in sync.
 */

import { createSlice } from '@reduxjs/toolkit';

// Initial state: attempt to hydrate from localStorage, or default to null
const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * setUser
     *
     * Stores the provided user payload in Redux state and persists it to localStorage.
     *
     * @param {Object} state - Current slice state
     * @param {Object} action - Redux action, with action.payload containing the user object
     */
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    /**
     * logout
     *
     * Clears the user from Redux state and removes it from localStorage.
     * Effectively logs the user out.
     *
     * @param {Object} state - Current slice state
     */
    logout: state => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

// Export actions for dispatching in components or thunks
export const { setUser, logout } = userSlice.actions;

// Export the reducer to be registered in the Redux store
export default userSlice.reducer;
