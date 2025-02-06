import Cookies from 'js-cookie';

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

const addRefreshToken = (url: string) => async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      return await fetch(input,{
        ...init,
        credentials: 'include',
      });
    }
  }

  return response;
};

export const clientFetch = (input: RequestInfo, init?: RequestInit) => {
  const refreshToken = addRefreshToken('/api/auth/refresh');
  const csrfOptions = addCsrfHeader(init);

  return refreshToken(input, csrfOptions);
};

export const serverFetch = addRefreshToken('http://localhost:4000/api/auth/refresh');
