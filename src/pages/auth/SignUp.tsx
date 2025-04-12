import React, { useState } from 'react';
import { registerUser } from '../../handlers/api/auth.api';
import { Link } from 'react-router';
// Assuming you've added the API function

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: '', // Added confirmPassword field
    phone: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setErrorMessage(''); // Clear error message if passwords match

    try {
      const data = await registerUser({
        email: formData.email,
        name: formData.name,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
      });
      console.log('User registered successfully:', data);
      // Redirect or show success message here
    } catch (error) {
      setErrorMessage(
        'Registration failed: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  };

  return (
    <div className="flex h-screen container p-10">
      <section className="w-1/2 h-full border-[#9EB1C7] border rounded-r-md shadow-md py-16 px-10 flex flex-col justify-between">
        <img src="auth-logo.png" alt="auth logo" className="mx-auto" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="font-bold text-2xl">Sign Up</h1>
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="phone" className="font-semibold text-lg">
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
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="name" className="font-semibold text-lg">
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
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="email" className="font-semibold text-lg">
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
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="password" className="font-semibold text-lg">
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
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="confirmPassword" className="font-semibold text-lg">
              Password Confirmation
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Password Confirmation"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Display error message if passwords don't match */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="bg-[#FF9870] text-white w-full p-2.5 rounded-md cursor-pointer"
          >
            Sign Up
          </button>

          <div className="flex space-x-0.5">
            <p>Already have an account?</p>
            <Link to={'/login'} className="underline text-[#FF9870]">
              Sign In
            </Link>
          </div>
        </form>
      </section>
      <section className="bg-[#FFE8DE] flex items-center justify-center w-1/2 h-full border-[#9EB1C7] border rounded-l-md shadow-md">
        <img src="auth.png" alt="auth image" />
      </section>
    </div>
  );
}

export default SignUp;
