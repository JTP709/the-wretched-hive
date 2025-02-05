import { headers } from "next/headers";

export const getUser = async () => {
  const incomingHeaders = headers();
  const cookie = (await incomingHeaders).get('cookie') || '';
  const userResponse = await fetch('http://localhost:4000/api/users/', {
    headers: new Headers({ cookie }),
    credentials: 'include',
    cache: 'no-store',
  });

  const user = await userResponse.json();

  return user;
};
