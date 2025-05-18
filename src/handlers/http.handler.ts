// src/handlers/api-handler.ts

/**
 * HTTP Client Module
 *
 * Provides a thin wrapper around the Fetch API with:
 * - Base URL resolution from environment variables.
 * - Automatic JSON parsing and error handling.
 * - Authorization header injection from localStorage.
 * - Convenience methods for GET, POST, PUT, PATCH, and DELETE.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * ApiError
 *
 * Custom error class to encapsulate HTTP response details.
 *
 * @template T - Expected shape of the error response payload.
 * @property status - HTTP status code returned by the server.
 * @property data   - Parsed response body (JSON or text).
 */
export class ApiError<T = unknown> extends Error {
  status: number;
  data: T;

  constructor(message: string, status: number, data: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  method: string;
  body?: string;
  headers: Record<string, string>;
}

/**
 * getAuthToken
 *
 * Retrieves the stored authentication token from localStorage.
 *
 * @returns Bearer token string or null if not present.
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * handleResponse
 *
 * Parses the HTTP response, throwing ApiError on non-2xx status codes.
 *
 * @template T - Expected type of the successful response payload.
 * @param response - The Fetch API Response object.
 * @returns Parsed response data as type T.
 * @throws ApiError with status and payload when response.ok is false.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('Content-Type') || '';
  const isJson = contentType.includes('application/json');

  // Parse JSON if applicable, otherwise read as text
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Attempt to extract a meaningful error message
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? (data as { message?: string }).message || 'API Error'
        : 'API Error';

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

/**
 * request
 *
 * Core function to perform an HTTP request with automatic headers and error handling.
 *
 * @template TResponse - Expected type of the successful response payload.
 * @param method        - HTTP method (GET, POST, etc.).
 * @param url           - Endpoint path, appended to BASE_URL.
 * @param body          - Optional request body object; JSON-stringified if present.
 * @param customHeaders - Optional additional headers to merge.
 * @returns Parsed response data as type TResponse.
 */
async function request<TResponse>(
  method: string,
  url: string,
  body?: object,
  customHeaders: Record<string, string> = {},
): Promise<TResponse> {
  // Default headers for JSON requests
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Inject Authorization header when token is available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestOptions = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  // Execute fetch against the full URL
  const response = await fetch(`${BASE_URL}${url}`, options);
  return handleResponse<TResponse>(response);
}

/**
 * http
 *
 * Public API with convenience methods for each HTTP verb.
 */
export const http = {
  /**
   * GET request
   * @template T - Expected response type
   * @param url - Endpoint path
   * @param headers - Optional headers to merge
   */
  get: <T>(url: string, headers: Record<string, string> = {}) =>
    request<T>('GET', url, undefined, headers),

  /**
   * POST request
   * @template T - Expected response type
   * @param url - Endpoint path
   * @param body - Request payload object
   * @param headers - Optional headers to merge
   */
  post: <T>(url: string, body: object, headers: Record<string, string> = {}) =>
    request<T>('POST', url, body, headers),

  /**
   * PUT request
   * @template T - Expected response type
   * @param url - Endpoint path
   * @param body - Request payload object
   * @param headers - Optional headers to merge
   */
  put: <T>(url: string, body: object, headers: Record<string, string> = {}) =>
    request<T>('PUT', url, body, headers),

  /**
   * PATCH request
   * @template T - Expected response type
   * @param url - Endpoint path
   * @param body - Request payload object
   * @param headers - Optional headers to merge
   */
  patch: <T>(url: string, body: object, headers: Record<string, string> = {}) =>
    request<T>('PATCH', url, body, headers),

  /**
   * DELETE request
   * @template T - Expected response type
   * @param url - Endpoint path
   * @param headers - Optional headers to merge
   */
  delete: <T>(url: string, headers: Record<string, string> = {}) =>
    request<T>('DELETE', url, undefined, headers),
};
