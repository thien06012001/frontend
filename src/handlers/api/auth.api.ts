import { api_endpoints } from '../../constants/urls';
import { http } from '../http.handler';

export interface SignUpData {
  email: string;
  name: string;
  username: string;
  password: string;
  phone?: string;
}

export const registerUser = async (data: SignUpData) => {
  try {
    const response = await http.post<{ message: string; data: SignUpData }>(
      api_endpoints.auth.REGISTER,
      data,
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Registration failed: ' + error.message);
    } else {
      throw new Error('Registration failed: Unknown error');
    }
  }
};
