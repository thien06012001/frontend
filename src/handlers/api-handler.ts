import { BASE_URL } from '../constants/urls';

export const handleAPI = async (endpoint: string, option: RequestInit) => {
  return await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...option.headers,
    },
    ...option,
  });
};
