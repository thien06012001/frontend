import { useSelector } from 'react-redux';
import { RootState } from './store';

// Custom hook to access user information from the Redux store
export const useUser = () => {
  // Select the user data from the Redux store
  const user = useSelector((state: RootState) => state.users.user);

  return user;
};

export default useUser;
