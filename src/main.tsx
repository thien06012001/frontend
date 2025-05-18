// Entry point for the React application.
// Renders the root component tree into the HTML document.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; // Global CSS resets and custom styles

// Redux store provider for global state management
import { Provider } from 'react-redux';
import store from './hooks/redux/store';

// React Router v6 data APIs
import { createBrowserRouter, RouterProvider } from 'react-router';

// Page and layout components
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Layout from './components/shared/Layout';

// Context provider for toasts/notifications
import { ToastProvider } from './hooks/context/ToastContext';

// Route-specific page components
import EventCreate from './pages/EventCreate';
import ParticipateEvents from './pages/ParticipateEvents';
import MyEvents from './pages/MyEvents';
import Invitations from './pages/Invitations';
import NotificationPage from './pages/Notification';
import EventDetail from './pages/EventDetail';
import AdminSetting from './pages/AdminSetting';
import UserInfo from './pages/UserInfo';

// Configure client-side routing:
// - The root path ("/") uses <Layout> to wrap child routes with sidebar/header.
// - Non-layout routes like "/login" and "/signup" render standalone pages.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Shared layout with sidebar & header
    errorElement: <NotFound />, // Fallback for unmatched routes
    children: [
      { path: '/', element: <Home /> }, // Dashboard overview
      { path: '/create-event', element: <EventCreate /> }, // Event creation form
      { path: '/participate-events', element: <ParticipateEvents /> }, // Events user participates in
      { path: '/my-events', element: <MyEvents /> }, // Events created by the user
      { path: '/invitations', element: <Invitations /> }, // Invitation management
      { path: '/notifications', element: <NotificationPage /> }, // User notifications
      { path: '/event/:id', element: <EventDetail /> }, // Dynamic event detail view
      { path: '/admin', element: <AdminSetting /> }, // Admin configuration page
      { path: '/user', element: <UserInfo /> },
    ],
  },
  {
    path: '/login',
    element: <Login />, // Standalone login page (no sidebar)
  },
  {
    path: '/signup',
    element: <SignUp />, // Standalone signup page (no sidebar)
  },
]);

// Mount the React component tree into the DOM:
// - <StrictMode> enables additional checks and warnings in development.
// - <Provider> makes the Redux store available to all components.
// - <ToastProvider> supplies toast context for global notifications.
// - <RouterProvider> initializes the router configuration above.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  </StrictMode>,
);
