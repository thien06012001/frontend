import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../hooks/redux/store';
import { fetchUsers } from '../hooks/redux/slices/user.slice';
function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {data.map(user => (
          <li key={user.id}>
            {user.name} ({user.username}) - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
