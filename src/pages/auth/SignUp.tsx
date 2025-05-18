// src/pages/SignUp.tsx

/**
 * SignUp Component
 *
 * Renders a registration form with the following features:
 * - Collects user details: phone, full name, email, password, and password confirmation.
 * - Validates that password and confirmation match before submitting.
 * - Displays error messages for mismatches or API errors.
 * - Redirects to the login page upon successful registration.
 */

import React, { useState } from 'react'; // React core and hooks
import { Link } from 'react-router'; // Router Link for navigation
import Button from '../../components/ui/Button'; // Reusable Button component
import { api_endpoints } from '../../constants/urls'; // Centralized API endpoint URLs
import { handleAPI } from '../../handlers/api-handler'; // API request helper

export default function SignUp() {
  // Form state: captures all input field values
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: '', // For matching password validation
    phone: '',
  });

  // UI state: loading indicator and error messaging
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * handleChange
   *
   * Updates `formData` state for controlled inputs.
   *
   * @param e - ChangeEvent from an input element
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * handleSubmit
   *
   * Validates password match and submits registration data to the API.
   * Displays error message on failure, or redirects on success.
   *
   * @param e - FormEvent from the registration form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Front-end validation: ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setErrorMessage(''); // Clear any previous error
    setIsLoading(true); // Show loading state

    try {
      // Perform API call to registration endpoint
      const res = await handleAPI(api_endpoints.auth.REGISTER, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (!res.ok) {
        // Display server-provided error message
        setErrorMessage(result.error || 'Registration failed');
      } else {
        // Redirect to login page on successful registration
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex h-screen lg:p-10">
      {/* Registration form section */}
      <section className="w-full lg:w-1/2 h-full border-[#9EB1C7] border rounded-r-md shadow-md py-16 px-10 flex flex-col justify-around">
        {/* Logo */}
        <img src="/logo.png" alt="Application Logo" className="mx-auto" />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="font-bold text-2xl">Sign Up</h1>

          {/* Phone Number Input */}
          <div className="flex flex-col my-1 w-full">
            <label htmlFor="phone" className="font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Full Name Input */}
          <div className="flex flex-col my-1 w-full">
            <label htmlFor="name" className="font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col my-1 w-full">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col my-1 w-full">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col my-1 w-full">
            <label htmlFor="confirmPassword" className="font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Display validation or server error messages */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <Button disabled={isLoading} type="submit" className="w-full my-1">
            {isLoading ? (
              <span className="font-semibold">Loading...</span>
            ) : (
              <span className="font-semibold">Sign Up</span>
            )}
          </Button>

          {/* Link to Sign In page for existing users */}
          <div className="flex space-x-0.5">
            <p>Already have an account?</p>
            <Link to="/login" className="underline text-primary">
              Sign In
            </Link>
          </div>
        </form>
      </section>

      {/* Side image for large screens */}
      <section className="bg-[#FFE8DE] hidden lg:flex items-center justify-center w-1/2 h-full border-[#9EB1C7] border rounded-l-md shadow-md">
        <img src="/auth.png" alt="Authentication Illustration" />
      </section>
    </div>
  );
}
