// src/pages/UserInfo.tsx

/**
 * UserInfo Component
 *
 * Allows users to view and update their profile information.
 * - Displays a form populated with the user's current data.
 * - Email is displayed as read-only.
 * - Users can update their name, phone number, and optionally password.
 */

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'; // React hooks
import useUser from '../hooks/redux/useUser'; // Hook to get user from Redux
import { handleAPI } from '../handlers/api-handler'; // API handler utility
import { useToast } from '../hooks/context/ToastContext'; // Toast notification context
import { useFetch } from '../hooks/useFetch'; // Data fetching hook

/**
 * Interface defining the shape of the user info form.
 */
interface UserInfoForm {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export default function UserInfo() {
  const user = useUser(); // Retrieve current user from Redux store
  const { showToast } = useToast(); // Function to display toast notifications
  const { data } = useFetch(`/users/${user.id}`, { method: 'GET' }); // Fetch latest user data
  console.log(data); // Debug: log fetched data (remove in production)

  // Initialize form state with values from Redux user; phone & password start empty
  const [form, setForm] = useState<UserInfoForm>({
    email: user.email,
    name: user.name,
    phone: '',
    password: '',
  });

  // Update form fields when fetched data becomes available
  useEffect(() => {
    if (data) {
      setForm(prev => ({
        ...prev,
        name: data.data.name, // Populate name field
        phone: data.data.phone || '', // Populate phone or default to empty
      }));
    }
  }, [data]);

  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  /**
   * Handle change for all input fields.
   * Updates the corresponding field in form state.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission.
   * - Prevents default form behavior.
   * - Shows loading state.
   * - Constructs payload with mandatory fields and optional password.
   * - Sends PUT request to update user profile.
   * - Displays success or error toast.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Construct payload: always include name and phone, include password only if provided
    const payload: Partial<UserInfoForm> = {
      name: form.name,
      phone: form.phone,
    };
    if (form.password) {
      payload.password = form.password;
    }

    try {
      const res = await handleAPI(`/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(); // Trigger catch block on failure

      showToast('Profile updated successfully', 'success');
      setForm(prev => ({ ...prev, password: '' })); // Clear password field after success

      // TODO: Dispatch updated fields to Redux store for global state consistency
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="space-y-5 p-5 border border-gray-200 shadow-md rounded-md mt-5">
      <h1 className="text-3xl font-semibold">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Email (read-only) */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Name input */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Phone number input */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Password input */}
        <div>
          <label className="block mb-1 font-medium">
            New Password{' '}
            <span className="text-sm text-gray-500">
              (leave blank to keep current)
            </span>
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? 'Updating…' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
