const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN || 'http://localhost:3000';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ShortUrlResponse {
  shortCode: string;
}

interface UserResponse {
  token: string;
  refreshToken: string;
}

interface UrlData {
  shortCode: string;
  originalUrl: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API error:', errorData);
    throw new Error(errorData.message || 'An error occurred');
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const result = await response.json();
    console.log('API response:', result);
    return result;
  } else {
    // If the response is not JSON, assume it's a plain text token
    const token = await response.text();
    console.log('API response (token):', token);
    return { token } as T; // Cast to T to satisfy TypeScript
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/user/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { token, refreshToken: newRefreshToken } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      return true;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
  }

  return false;
}

export async function registerUser(email: string, password: string): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<UserResponse>(response);
}

export async function loginUser(email: string, password: string): Promise<{ token: string, refreshToken?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    if (!data.token) {
      console.error('Invalid server response:', data);
      throw new Error('Invalid response from server');
    }

    return { token: data.token, refreshToken: data.refreshToken };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found, user is already logged out');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Logout failed:', errorData);
      // We'll clear the tokens even if the server-side logout fails
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // We'll clear the tokens even if there's an error
  } finally {
    // Always clear tokens on the client side
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}

export async function shortenURL(url: string): Promise<{ shortUrl: string }> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE_URL}/url/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.message || 'Failed to shorten URL');
    }

    const data = await response.json();
    console.log('Server response:', data);

    if (!data || !data.shortCode) {
      console.error('Invalid server response:', data);
      throw new Error('Invalid response from server');
    }

    // Ensure we don't have a trailing slash in WEBSITE_DOMAIN
    const baseUrl = WEBSITE_DOMAIN.replace(/\/$/, '');
    return { shortUrl: `${baseUrl}/${data.shortCode}` };
  } catch (error) {
    console.error('Error in shortenURL:', error);
    throw error;
  }
}

export async function getUserUrls(): Promise<UrlData[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found when trying to get user URLs');
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/urls`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch user URLs:', errorData);
      throw new Error(errorData.message || 'Failed to fetch user URLs');
    }

    const data = await response.json();
    console.log('User URLs data:', data);
    
    // Check if data is an array
    if (Array.isArray(data)) {
      return data;
    } else if (data.urls && Array.isArray(data.urls)) {
      return data.urls;
    } else {
      console.error('Unexpected data structure:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    return [];
  }
}

export async function getOriginalUrl(shortCode: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/url/${shortCode}`);
    if (!response.ok) {
      throw new Error('URL not found');
    }
    const data = await response.json();
    return data.originalUrl;
  } catch (error) {
    console.error('Error fetching original URL:', error);
    throw error;
  }
}

export async function deleteURL(shortCode: string): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await fetch(`${API_BASE_URL}/url/${shortCode}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.message || 'Failed to delete URL');
    }

    console.log('URL deleted successfully');
  } catch (error) {
    console.error('Error in deleteURL:', error);
    throw error;
  }
}

export async function getLatestUrl(): Promise<UrlData | null> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found when trying to get latest URL');
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/url/latest`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch latest URL:', errorData);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching latest URL:', error);
    return null;
  }
}