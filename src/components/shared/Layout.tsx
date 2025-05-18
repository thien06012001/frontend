// src/components/shared/Layout.tsx

import React, { useState } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import { RootState } from '../../hooks/redux/store';
import useUser from '../../hooks/redux/useUser';

/**
 * Layout component
 *
 * Wraps protected routes with authentication and authorization guards,
 * and provides responsive sidebar, header, and main content area.
 */
const Layout: React.FC = () => {
  // Retrieve raw user object (with token) from Redux
  const user = useSelector((state: RootState) => state.users.user);
  // Decrypted and parsed user data from token
  const userData = useUser();
  // Current URL path for route-based authorization
  const { pathname } = useLocation();
  // State to control mobile sidebar visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Guard #1: redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Guard #2: restrict admin routes to users with 'admin' role
  if (pathname.startsWith('/admin') && userData.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen flex-col ipad:flex-row">
      {/* Mobile top bar: visible on small screens only */}
      <div className="flex items-center justify-between bg-white p-2 border-b border-gray-200 md:hidden">
        {/* Hamburger button toggles mobile sidebar */}
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className="p-2 focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Quick link to create a new event */}
        <Link to="/create-event">
          <button className="bg-primary text-white px-4 py-1 rounded-md">
            Create Event
          </button>
        </Link>
      </div>

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-0 z-40 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out md:hidden`}
      >
        <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Desktop sidebar: hidden on small screens */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content area: header + routed pages */}
      <main className="flex-1 flex flex-col p-4 bg-gray-50 overflow-auto">
        <Header />
        {/* Renders child routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
