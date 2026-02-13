import { useAuthStore } from '../store/auth';
import { httpDelete, httpGet, httpPost } from './http';

export function useAuthApi() {
  const { accessToken } = useAuthStore.getState();

  function withToken() {
    return { token: accessToken || undefined };
  }

  return {
    get: <T>(path: string) => httpGet<T>(path, withToken()),
    post: <TResp, TBody = unknown>(path: string, body: TBody) =>
      httpPost<TResp, TBody>(path, body, withToken()),
    del: <T>(path: string) => httpDelete<T>(path, withToken()),
  };
}

