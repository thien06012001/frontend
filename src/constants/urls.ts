// src/constants/urls.ts

/**
 * api_endpoints
 *
 * Centralized definitions for all API paths used in the application.
 * - Groups endpoints by feature (e.g., `user`, `auth`).
 * - Provides both static strings and helper functions for dynamic routes.
 */
export const api_endpoints = {
  user: {
    /** Base path for all user-related operations */
    ORIGIN: '/users',

    /**
     * Path to get a user by ID.
     * @param id - Unique identifier of the user
     * @returns URL string for GET /users/:id
     */
    getById: (id: string) => `/users/${id}`,

    /**
     * Path to update a user by ID.
     * @param id - Unique identifier of the user
     * @returns URL string for PUT /users/:id
     */
    update: (id: string) => `/users/${id}`,

    /**
     * Path to delete a user by ID.
     * @param id - Unique identifier of the user
     * @returns URL string for DELETE /users/:id
     */
    delete: (id: string) => `/users/${id}`,
  },

  auth: {
    /** Endpoint for user registration (POST). */
    REGISTER: '/auth/register',

    /** Endpoint for user login (POST). */
    LOGIN: '/auth/login',
  },
};

/**
 * BASE_URL
 *
 * The root URL for all API requests.
 * - Loaded from VITE_API_BASE_URL environment variable.
 * - Falls back to an empty string if not defined.
 */
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * SECRET_KEY
 *
 * Secret key used for client-side encryption/decryption routines.
 * - Loaded from VITE_SECRET_KEY environment variable.
 * - Falls back to an empty string if not defined.
 */
export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || '';
