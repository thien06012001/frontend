import Statistic from '../components/pages/home/Statistic';
import Tracking from '../components/pages/home/Tracking';

function Home() {
  return (
    <>
      <h1 className="text-4xl my-5">Dashboard</h1>
      <Statistic />
      <Tracking />
    </>
  );
}

export default Home;
