export const api_endpoints = {
  user: {
    ORIGIN: '/users',
    getById: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  auth: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
};

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || '';