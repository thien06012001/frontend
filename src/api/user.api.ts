import { api_endpoints } from '../constants/urls';
import { http } from '../handlers/http.handler';
import { User } from '../hooks/redux/slices/user.slice';

export const getUserById = (id: string) =>
  http.get<{ data: User }>(api_endpoints.user.getById(id));

export const updateUser = (id: string, data: Partial<User>) =>
  http.put<{ data: User }>(api_endpoints.user.update(id), data);

export const deleteUser = (id: string) =>
  http.delete<{ data: boolean }>(api_endpoints.user.delete(id));
