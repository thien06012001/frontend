import { useRouteError } from 'react-router';

function NotFound() {
  const err = useRouteError();
  console.log(err);
  return <h1>NotFound</h1>;
}

export default NotFound;
