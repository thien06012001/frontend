export const api_endpoints = {
  user: {
    ORIGIN: '/users',
    getById: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  auth: {
    REGISTER: '/auth/register', // Added registration endpoint here
  },
};
