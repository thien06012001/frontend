import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';

import { Provider } from 'react-redux';
import store from './hooks/redux/store';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Users from './pages/Users';
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
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
