export const addRefreshToken = (url: string) => async (input: RequestInfo, init?: RequestInit) => {
  const options: RequestInit = {
    ...init,
    credentials: 'include',
  };
  const response = await fetch(input, options);

  if (response.status === 401) {
    const refreshResponse = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: init?.headers,
    });

    if (refreshResponse.ok) {
      return await fetch(input, options);
    }
  }

  return response;
};
