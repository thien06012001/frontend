import { useSelector } from 'react-redux';
import { RootState } from './store';
import { SECRET_KEY } from '../../constants/urls';

const decrypt = (encoded: string): string => {
  const text = atob(encoded); // base64 decode
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const t = text.charCodeAt(i);
    const k = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    result += String.fromCharCode(t ^ k);
  }
  return result;
};

// Custom hook to access user information from the Redux store
export const useUser = () => {
  const user = useSelector((state: RootState) => state.users.user);

  if (!user || !user.token) return null; // ✅ graceful fallback

  try {
    const res = decrypt(user.token);
    const parsedUser = JSON.parse(res);
    return parsedUser;
  } catch (err) {
    console.error('Failed to decrypt user token:', err);
    return null;
  }
};

export default useUser;
