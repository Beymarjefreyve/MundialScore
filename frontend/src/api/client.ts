const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

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
      // Try to parse JSON error message from backend
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If JSON parsing fails, use statusText
      }
      console.error(`API Error: ${response.status} ${errorMessage}`);
      throw new ApiError(response.status, errorMessage);
    }

    if (response.status === 204) return {} as T;

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error; 
  }
}

export { request };

