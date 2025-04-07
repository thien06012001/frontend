import { http } from '../handlers/http.handler';
import { User } from '../hooks/redux/slices/user.slice';

export const getUserById = (id: string) => {
  http.get<{ data: User }>(`/users/${id}`);
};
export const updateUser = (id: string, data: Partial<User>) =>
  http.put<{ data: User }>(`/users/${id}`, data);

export const deleteUser = (id: string) =>
  http.delete<{ data: boolean }>(`/users/${id}`);
