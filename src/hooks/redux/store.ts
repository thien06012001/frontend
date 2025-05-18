// src/hooks/redux/store.ts

/**
 * Redux Store Configuration
 *
 * - Initializes the Redux store using Redux Toolkit's `configureStore`.
 * - Registers the `users` slice reducer under `state.users`.
 * - Exports `RootState` and `AppDispatch` types for strong typing in selectors and dispatch.
 */

import { configureStore } from '@reduxjs/toolkit'; // Toolkit helper to create the store
import usersReducer from './slices/user.slice'; // Reducer handling user authentication and profile

// Configure and create the Redux store
const store = configureStore({
  reducer: {
    users: usersReducer, // State key: "users", Value: usersReducer
  },
});

// Derive the RootState type from the store's state structure
export type RootState = ReturnType<typeof store.getState>;

// Derive the AppDispatch type from the store's dispatch method
export type AppDispatch = typeof store.dispatch;

// Export the configured store instance for use in <Provider>
export default store;
