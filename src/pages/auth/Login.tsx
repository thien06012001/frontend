import { Link } from 'react-router';

function Login() {
  return (
    <div className="flex h-screen container p-10">
      <section className="bg-[#FFE8DE] flex items-center justify-center w-1/2 h-full border-[#9EB1C7] border rounded-l-md shadow-md">
        <img src="auth.png" alt="auth image" />
      </section>
      <section className="w-1/2 h-full border-[#9EB1C7] border rounded-r-md shadow-md py-16 px-10 space-y-36">
        <img src="auth-logo.png" alt="auth logo" className="mx-auto" />
        <form action="" className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-2xl">Sign In</h1>
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>
          <div className="flex flex-col my-2 w-full">
            <label htmlFor="password" className="font-semibold text-lg">
              Password
            </label>
            <input
              type="text"
              placeholder="Password"
              id="password"
              className="p-2 rounded-md border-[#CBD5E1] border"
            />
          </div>
          <button className="bg-[#FF9870] text-white w-full my-2 p-2.5 rounded-md cursor-pointer">
            Sign In
          </button>
          <div className="flex justify-between items-center w-full my-2">
            <Link to={'/'} className="underline text-[#FF9870]">
              For got password?
            </Link>
            <div className="flex space-x-0.5">
              <p>Not register?</p>
              <Link to={'/signup'} className="underline text-[#FF9870]">
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
