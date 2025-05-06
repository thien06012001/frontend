import { Link, Navigate, redirect } from 'react-router';

import Button from '../../components/ui/Button';

import { useState } from 'react';
import { handleAPI } from '../../handlers/api-handler';
import { api_endpoints } from '../../constants/urls';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../hooks/redux/slices/user.slice';
import { RootState } from '../../hooks/redux/store';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const user = useSelector((state: RootState) => state.users.user);
  if (user) {
    return <Navigate to="/" replace />;
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await handleAPI(api_endpoints.auth.LOGIN, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (!res.ok) {
      setErrorMessage(result.error);
    } else {
      // Store user data in local storage
      dispatch(
        setUser({
          id: result.data.id,
          email: result.data.email,
        }),
      );
      redirect('/');
    }

    setIsLoading(false);
  };
  return (
    <div className="flex h-screen container p-10">
      <section className="bg-[#FFE8DE] flex items-center justify-center w-1/2 h-full border-[#9EB1C7] border rounded-l-md shadow-md">
        <img src="/auth.png" alt="auth image" />
      </section>

      <section className="w-1/2 h-full border-[#9EB1C7] border rounded-r-md shadow-md py-16 px-10 flex flex-col justify-around">
        <img src="/logo.png" alt="logo" className="mx-auto" />

        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col items-center justify-center"
        >
          <h1 className="font-bold text-2xl">Sign In</h1>

          <div className="flex flex-col my-2 w-full">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          <div className="flex flex-col my-2 w-full">
            <label htmlFor="password" className="font-semibold text-lg">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>

          {/* Display error message if passwords don't match */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Loading...' : 'Login'}
          </Button>

          <div className="flex justify-between items-center w-full my-2">
            <Link to={'/'} className="underline text-primary">
              For got password?
            </Link>

            <div className="flex space-x-0.5">
              <p>Not register?</p>
              <Link to={'/signup'} className="underline text-primary">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
