import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';

import { Provider } from 'react-redux';
import store from './hooks/redux/store';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Users from './pages/Users';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Layout from './components/shared/Layout';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // <- Sidebar layout
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/users', element: <Users /> },
    ],
  },
  {
    path: '/login',
    element: <Login />, // <- No sidebar
  },
  {
    path: '/signup',
    element: <SignUp />, // <- No sidebar
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
