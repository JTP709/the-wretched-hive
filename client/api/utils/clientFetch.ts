import Cookies from "js-cookie";
import { addRefreshToken } from "./shared";

const addCsrfHeader = (init?: RequestInit) => {
  const csrfToken = Cookies.get('XSRF-TOKEN');
  const headers = new Headers(init?.headers);
  headers.set('X-CSRF-Token', csrfToken ?? '');

  const options: RequestInit = {
    ...init,
    credentials: 'include',
    headers,
  };

  return options;
};

export const clientFetch = (input: RequestInfo, init?: RequestInit) => {
  const refreshToken = addRefreshToken('/api/auth/refresh');
  const csrfOptions = addCsrfHeader(init);

  return refreshToken(input, csrfOptions);
};
