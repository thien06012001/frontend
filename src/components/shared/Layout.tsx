// components/Layout.tsx

import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
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
