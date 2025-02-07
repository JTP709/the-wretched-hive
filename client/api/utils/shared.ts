export const addRefreshToken = (url: string) => async (input: RequestInfo, init?: RequestInit) => {
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
