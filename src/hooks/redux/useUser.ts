// src/hooks/redux/useUser.ts

import { useSelector } from 'react-redux';
import { RootState } from './store';
import { SECRET_KEY } from '../../constants/urls';

/**
 * decrypt
 *
 * De-obfuscates a base64-encoded, XOR-encrypted string using a shared secret key.
 *
 * @param encoded - Base64-encoded string to decrypt.
 * @returns The original plaintext string.
 */
const decrypt = (encoded: string): string => {
  // Decode from Base64 to raw binary string
  const text = atob(encoded);

  let result = '';
  // XOR each character code with the corresponding key character code
  for (let i = 0; i < text.length; i++) {
    const encryptedCharCode = text.charCodeAt(i);
    const keyCharCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    // Append decrypted character to result
    result += String.fromCharCode(encryptedCharCode ^ keyCharCode);
  }

  return result;
};

/**
 * useUser
 *
 * Custom React hook to retrieve the current user object from Redux state.
 * - Expects a `user.token` that contains a base64 + XOR-encrypted JSON payload.
 * - Returns `null` if no valid user token is present or decryption/parsing fails.
 *
 * @returns The parsed user object or `null` if unauthenticated or on error.
 */
export const useUser = () => {
  // Select the user slice from the Redux store
  const user = useSelector((state: RootState) => state.users.user);

  // If no user or no token is available, return null (unauthenticated)
  if (!user || !user.token) {
    return null;
  }

  try {
    // Decrypt and parse the token payload
    const decrypted = decrypt(user.token);
    const parsedUser = JSON.parse(decrypted);
    return parsedUser;
  } catch (err) {
    // Log decryption/parsing errors and fallback to null
    console.error('Failed to decrypt or parse user token:', err);
    return null;
  }
};

export default useUser;
