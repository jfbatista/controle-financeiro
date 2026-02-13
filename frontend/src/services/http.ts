import { apiConfig } from '../config/api';

export interface HttpError extends Error {
  status?: number;
  details?: unknown;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let body: any = null;
    try {
      body = await response.json();
    } catch {
      // ignore
    }
    const error: HttpError = new Error(
      body?.message || `Erro HTTP ${response.status}`,
    );
    error.status = response.status;
    error.details = body;
    throw error;
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function httpPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: { token?: string },
): Promise<TResponse> {
  const url = `${apiConfig.baseUrl}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<TResponse>(response);
}

export async function httpGet<TResponse>(
  path: string,
  options?: { token?: string },
): Promise<TResponse> {
  const url = `${apiConfig.baseUrl}${path}`;
  const headers: HeadersInit = {};
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  return handleResponse<TResponse>(response);
}

