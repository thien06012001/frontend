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
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
