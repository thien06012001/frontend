// components/Layout.tsx

import { Navigate, Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../hooks/redux/store';

const Layout = () => {
  const user = useSelector((state: RootState) => state.users.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 pt-0 relative bg-gray-50 overflow-auto">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
