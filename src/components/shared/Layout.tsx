import { useState } from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import { RootState } from '../../hooks/redux/store';
import useUser from '../../hooks/redux/useUser';

const Layout = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const userData = useUser();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Guard #1: auth
  if (!user) return <Navigate to="/login" replace />;

  // Guard #2: admin routes
  if (pathname.startsWith('/admin') && userData.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen flex-col ipad:flex-row">
      {/* ─── Mobile Top Bar (only < md) ───────────────────────── */}
      <div className="flex items-center justify-between bg-white p-2 border-b border-gray-200 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className="p-2 focus:outline-none"
        >
          {/* simple hamburger */}
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
        <Link to="/create-event">
          <button className="bg-primary text-white px-4 py-1 rounded-md">
            Create Event
          </button>
        </Link>
      </div>

      {/* ─── Mobile Drawer ───────────────────────── */}
      <div
        className={`fixed inset-0 z-40 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out md:hidden`}
      >
        <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* ─── Desktop Sidebar ───────────────────────── */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* ─── Main Area ─────────────────────────────── */}
      <main className="flex-1 flex flex-col p-4 bg-gray-50 overflow-auto">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
