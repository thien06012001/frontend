import { useSelector } from 'react-redux';
// import Statistic from '../components/pages/home/Statistic';
import Event from '../components/pages/home/Events';
import { RootState } from '../hooks/redux/store';
import { Navigate } from 'react-router';

function Home() {
  const user = useSelector((state: RootState) => state.users.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Event />;
}

export default Home;
