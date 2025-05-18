// src/handlers/api/auth.handler.ts

/**
 * Authentication API Handlers
 *
 * Provides helper functions to call authentication-related endpoints
 * using the centralized `http` client.
 */

import { api_endpoints } from '../../constants/urls'; // Centralized endpoint definitions
import { http } from '../http.handler'; // HTTP client with built-in error handling

/**
 * SignUpData
 *
 * Defines the payload structure for user registration.
 *
 * @property email    - User's email address (required)
 * @property name     - User's full name (required)
 * @property username - Chosen username (required)
 * @property password - Account password (required)
 * @property phone    - Optional phone number
 */
export interface SignUpData {
  email: string;
  name: string;
  username: string;
  password: string;
  phone?: string;
}

/**
 * registerUser
 *
 * Sends a POST request to the registration endpoint with the provided user data.
 * - Uses the `http.post` helper for JSON encoding and error propagation.
 * - Returns the parsed response on success.
 * - Wraps and rethrows errors with a uniform message on failure.
 *
 * @param data - Payload conforming to SignUpData interface
 * @returns A promise resolving to the server response ({ message, data })
 * @throws Error with a contextual message if registration fails
 */
export const registerUser = async (data: SignUpData) => {
  try {
    // Call the REGISTER endpoint and expect a response with a message and echoed data
    const response = await http.post<{ message: string; data: SignUpData }>(
      api_endpoints.auth.REGISTER,
      data,
    );
    return response;
  } catch (error) {
    // Normalize and rethrow errors for upstream handling
    if (error instanceof Error) {
      throw new Error('Registration failed: ' + error.message);
    } else {
      throw new Error('Registration failed: Unknown error');
    }
  }
};
