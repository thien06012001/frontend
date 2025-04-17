// components/Layout.tsx

import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-5 pt-0 bg-gray-50">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
