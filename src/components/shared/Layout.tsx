// components/Layout.tsx
// ------------------------------------------
// Primary application layout component.
// - Wraps protected routes with sidebar and header.
// - Implements authentication and admin-only route guards.
// ------------------------------------------

import { Navigate, Outlet, useLocation } from 'react-router'; // Router utilities for navigation and nested routes
import { useSelector } from 'react-redux'; // Hook to access Redux store state
import Sidebar from './Sidebar'; // Side navigation panel component
import Header from './Header'; // Top header bar component
import { RootState } from '../../hooks/redux/store'; // RootState type for Redux store

const Layout = () => {
  // Retrieve the currently authenticated user from Redux
  const user = useSelector((state: RootState) => state.users.user);

  // Get current path to enforce admin-only access on /admin routes
  const { pathname } = useLocation();

  // ------------------------------------------
  // Guard #1: Redirect unauthenticated users to login
  // ------------------------------------------
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ------------------------------------------
  // Guard #2: Protect admin routes from non-admin users
  // If the path begins with "/admin" and user is not an admin,
  // redirect them back to the homepage.
  // ------------------------------------------
  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // ------------------------------------------
  // Render the main app layout for all other cases
  // Includes Sidebar, Header, and nested route content.
  // ------------------------------------------
  return (
    <div className="flex h-screen">
      {/* Sidebar: primary navigation menu */}
      <Sidebar />

      <main className="flex-1 flex flex-col p-5 pt-0 relative bg-gray-50 overflow-auto">
        {/* Header: top bar with user profile, notifications, etc. */}
        <Header />

        {/* Outlet: placeholder for child route components */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
