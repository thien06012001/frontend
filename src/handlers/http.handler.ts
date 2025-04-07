const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Custom API error class with status and data
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

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('Content-Type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? ((data as { message?: string }).message ?? 'API Error')
        : 'API Error';
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

async function request<TResponse>(
  method: string,
  url: string,
  body?: object,
  customHeaders: Record<string, string> = {},
): Promise<TResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestOptions = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${BASE_URL}${url}`, options);
  return handleResponse<TResponse>(response);
}

export const http = {
  get: <T>(url: string, headers: Record<string, string> = {}) =>
    request<T>('GET', url, undefined, headers),

  post: <T>(url: string, body: object, headers: Record<string, string> = {}) =>
    request<T>('POST', url, body, headers),

  put: <T>(url: string, body: object, headers: Record<string, string> = {}) =>
    request<T>('PUT', url, body, headers),

  patch: <T>(url: string, body: object, headers: Record<string, string> = {}) =>
    request<T>('PATCH', url, body, headers),

  delete: <T>(url: string, headers: Record<string, string> = {}) =>
    request<T>('DELETE', url, undefined, headers),
};
