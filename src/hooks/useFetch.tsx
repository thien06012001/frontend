/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useFetch.ts

import { useEffect, useState } from 'react';
import { handleAPI } from '../handlers/api-handler';

/**
 * Custom React hook for fetching data from an API endpoint.
 *
 * @param url - The endpoint URL (relative or absolute) to fetch.
 * @param options - Fetch options conforming to the RequestInit interface
 *                  (method, headers, body, etc.).
 * @returns An object containing:
 *   - isLoading: boolean indicating whether the request is in progress.
 *   - error:    an Error object if the request failed, or undefined.
 *   - data:     the parsed JSON response, or undefined.
 */
export const useFetch = (url: string, options: RequestInit) => {
  // Tracks whether the fetch request is currently active
  const [isLoading, setIsLoading] = useState(false);

  // Captures any network or response errors
  const [error, setError] = useState<Error | undefined>();

  // Holds the parsed JSON result of the response
  // Type `any` is used here, but you can replace it with a generic type if
  // you want stronger type safety based on the expected response shape.
  const [data, setData] = useState<any>();

  useEffect(() => {
    /**
     * fetchData
     *
     * Performs the API request using the handleAPI helper,
     * updates loading / error / data state accordingly.
     */
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Execute the HTTP request
        const response = await handleAPI(url, options);

        // If the response is not OK, throw to trigger error handling
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        // Parse the JSON payload
        const result = await response.json();

        // Update data state with parsed response
        setData(result);
      } catch (err) {
        // Capture and store any error encountered
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        // Always reset loading state when done
        setIsLoading(false);
      }
    };

    // Initiate fetch on mount
    fetchData();
    // We intentionally omit url/options from dependencies if you want a
    // one-time fetch. To refetch on URL or options change, include them here.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { isLoading, error, data };
};
