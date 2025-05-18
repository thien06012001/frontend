// src/pages/UserInfo.tsx

import { useState, ChangeEvent, FormEvent } from 'react';
import useUser from '../hooks/redux/useUser';
import { handleAPI } from '../handlers/api-handler';
import { useToast } from '../hooks/context/ToastContext';

interface UserInfoForm {
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
}

export default function UserInfo() {
  const user = useUser();
  const { showToast } = useToast();
  console.log(user);
  // initialize form with values from the Redux user
  const [form, setForm] = useState<UserInfoForm>({
    email: user.email,
    name: user.name,
    phoneNumber: user.phoneNumber || '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // only send name/phone, and password if non-empty
    const payload: Partial<UserInfoForm> = {
      name: form.name,
      phoneNumber: form.phoneNumber,
    };
    if (form.password) {
      payload.password = form.password;
    }

    try {
      const res = await handleAPI('/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast('Profile updated successfully', 'success');
      setForm(prev => ({ ...prev, password: '' }));
      // TODO: dispatch updated name/phone back into your Redux store
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
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

        {/* Name */}
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

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Password */}
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
