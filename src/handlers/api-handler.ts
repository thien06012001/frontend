// src/handlers/api-handler.ts

/**
 * handleAPI
 *
 * Wrapper around the Fetch API to simplify HTTP requests.
 * - Prepends the BASE_URL to the endpoint path.
 * - Merges default JSON headers with any custom headers provided.
 * - Passes through all other fetch options (method, body, etc.).
 *
 * @param endpoint - URL path (relative to BASE_URL) for the API request.
 * @param option   - Fetch options (method, headers, body, etc.).
 * @returns A Promise that resolves to the Fetch API Response object.
 */
import { BASE_URL } from '../constants/urls';

export const handleAPI = async (
  endpoint: string,
  option: RequestInit,
): Promise<Response> => {
  // Construct full URL by combining base URL and endpoint path
  const url = `${BASE_URL}${endpoint}`;

  // Merge default JSON headers with any provided in option.headers
  const headers = {
    'Content-Type': 'application/json',
    ...option.headers,
  };

  // Execute the fetch request with merged headers and passed-in options
  return fetch(url, {
    headers,
    ...option,
  });
};
