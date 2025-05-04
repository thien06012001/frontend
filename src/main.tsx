import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';

import { Provider } from 'react-redux';
import store from './hooks/redux/store';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Layout from './components/shared/Layout';
import { ToastProvider } from './hooks/context/ToastContext';
import EventCreate from './pages/EventCreate';
import ParticipateEvents from './pages/ParticipateEvents';
import MyEvents from './pages/MyEvents';
import Invitations from './pages/Invitations';
import NotificationPage from './pages/Notification';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // <- Sidebar layout
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/create-event', element: <EventCreate /> },
      { path: '/participate-events', element: <ParticipateEvents /> },
      { path: '/my-events', element: <MyEvents /> },
      { path: '/invitations', element: <Invitations /> },
      { path: 'notifications', element: <NotificationPage /> },
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
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  </StrictMode>,
);
