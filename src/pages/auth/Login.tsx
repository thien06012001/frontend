// src/pages/Login.tsx

/**
 * Login Component
 *
 * Renders the user login form and handles authentication.
 * - If a user is already logged in (present in Redux state), redirects to the homepage.
 * - Collects email and password input from the user.
 * - Sends credentials to the login API endpoint.
 * - Displays server-side error messages when authentication fails.
 * - Stores the returned token in Redux on successful login and navigates to the homepage.
 */

import React, { useState } from 'react'; // React core and hooks
import { Link, Navigate, redirect } from 'react-router'; // Router components for navigation
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks for dispatching actions and selecting state
import Button from '../../components/ui/Button'; // Reusable Button component
import { handleAPI } from '../../handlers/api-handler'; // Utility for making HTTP requests
import { api_endpoints } from '../../constants/urls'; // Centralized API endpoint definitions
import { setUser } from '../../hooks/redux/slices/user.slice'; // Redux action to store user data
import { RootState } from '../../hooks/redux/store'; // RootState type for Redux store

export default function Login() {
  // Local UI state
  const [isLoading, setIsLoading] = useState(false); // Tracks whether the login request is in flight
  const [formData, setFormData] = useState({
    // Controlled form inputs
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // Displays API error messages

  // Redux hooks
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.users.user); // Get current user from Redux store

  // If user is already authenticated, navigate back to homepage
  if (user) {
    return <Navigate to="/" replace />;
  }

  /**
   * handleChange
   *
   * Updates formData state when input values change.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * handleSubmit
   *
   * Sends login credentials to the API.
   * On success: stores returned token in Redux and redirects to homepage.
   * On failure: displays error message from server response.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await handleAPI(api_endpoints.auth.LOGIN, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();
      if (!res.ok) {
        // Show server-provided error message
        setErrorMessage(result.error || 'Login failed');
      } else {
        // Store authentication token in Redux
        dispatch(setUser({ token: result.data.token }));
        // Navigate to homepage
        redirect('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen lg:p-10">
      {/* Illustration section for large screens */}
      <section className="hidden lg:flex w-1/2 h-full items-center justify-center bg-[#FFE8DE] border-[#9EB1C7] border rounded-l-md shadow-md">
        <img src="/auth.png" alt="Authentication Illustration" />
      </section>

      {/* Login form section */}
      <section className="w-full lg:w-1/2 h-full border-[#9EB1C7] border rounded-r-md shadow-md py-16 px-10 flex flex-col justify-around">
        {/* Logo */}
        <img src="/logo.png" alt="Application Logo" className="mx-auto" />

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="font-bold text-2xl">Sign In</h1>

          {/* Email input */}
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="password" className="font-semibold text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Display error message if login fails */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {/* Submit button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Loading...' : 'Login'}
          </Button>

          {/* Additional navigation links */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full my-2">
            <Link to="/" className="underline text-primary">
              Forgot password?
            </Link>
            <div className="flex space-x-0.5">
              <p>Not registered?</p>
              <Link to="/signup" className="underline text-primary">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
