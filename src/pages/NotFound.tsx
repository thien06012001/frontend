// src/pages/NotFound.tsx

/**
 * NotFound Component
 *
 * Renders a user-friendly 404 error page when a route does not match any defined paths.
 * - Uses `useRouteError` to access routing error information (logged for debugging).
 * - Displays a headline, explanatory text, and a call-to-action button to return home.
 */

import { Link, useRouteError } from 'react-router'; // Router Link and error hook

export default function NotFound() {
  // Retrieve error details from the router (for diagnostics)
  const err = useRouteError();
  console.error('Route error:', err);

  return (
    <main
      className="
        grid min-h-full place-items-center
        bg-white px-6 py-24 sm:py-32 lg:px-8
      "
    >
      <div className="text-center">
        {/* Error code */}
        <p className="text-base font-semibold text-indigo-600">404</p>

        {/* Main heading */}
        <h1
          className="
            mt-4 text-5xl font-semibold tracking-tight
            text-gray-900 sm:text-7xl
          "
        >
          Page not found
        </h1>

        {/* Supporting message */}
        <p
          className="
            mt-6 text-lg font-medium text-gray-500
            sm:text-xl/8
          "
        >
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        {/* Action buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {/* Primary action: navigate back home */}
          <Link
            to="/"
            className="
              rounded-md bg-indigo-600 px-3.5 py-2.5
              text-sm font-semibold text-white shadow-xs
              hover:bg-indigo-500 focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-indigo-600
            "
          >
            Go back home
          </Link>

          {/*
          // Uncomment below to add a "Contact Support" link if needed
          <Link
            to="/"
            className="text-sm font-semibold text-gray-900"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
          */}
        </div>
      </div>
    </main>
  );
}
