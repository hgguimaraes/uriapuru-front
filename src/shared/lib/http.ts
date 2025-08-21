/**
 * HTTP client wrapper with tenant and request ID injection
 */

interface HttpOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function http(path: string, opts: HttpOptions = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const headers = new Headers(opts.headers || {});
  
  // Inject required headers
  const requestId = crypto.randomUUID();
  headers.set('x-request-id', requestId);
  headers.set('x-tenant-id', process.env.NEXT_PUBLIC_TENANT_ID || 'public');
  headers.set('Content-Type', 'application/json');

  // Add JWT token if available
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Handle query params
  let url = `${base}${path}`;
  if (opts.params) {
    const searchParams = new URLSearchParams();
    Object.entries(opts.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const { params, ...requestOpts } = opts;

  try {
    const response = await fetch(url, {
      ...requestOpts,
      headers,
    });

    const responseRequestId = response.headers.get('x-request-id') || requestId;

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new HttpError(response.status, errorMessage, responseRequestId);
    }

    // Handle empty responses (204, etc.)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, requestId);
  }
}

// Helper functions for different HTTP methods
export const httpGet = (path: string, params?: Record<string, string | number | boolean>) =>
  http(path, { method: 'GET', params });

export const httpPost = (path: string, body?: any) =>
  http(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });

export const httpPatch = (path: string, body?: any) =>
  http(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });

export const httpDelete = (path: string) =>
  http(path, { method: 'DELETE' });

// Auth token management (implement according to your auth strategy)
function getAuthToken(): string | null {
  // TODO: Implement based on your auth strategy
  // For cookie-based: will be handled by browser automatically
  // For localStorage: return localStorage.getItem('token')
  // For server-side: get from request context
  return null;
}