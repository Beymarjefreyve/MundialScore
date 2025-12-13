const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token) {
    // @ts-ignore
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      // Basic error handling visual message (console for now, maybe toast via event later)
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new ApiError(response.status, response.statusText);
    }

    if (response.status === 204) return {} as T;

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    // Trigger a visual error if possible, for now just rethrow
    throw error; 
  }
}

export { request };
