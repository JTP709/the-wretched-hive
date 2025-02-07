import { headers } from "next/headers";
import { serverFetch } from "../utils/apiFetch";

export const getHealth = async () => {
  const incomingHeaders = headers();
  const cookie = (await incomingHeaders).get('cookie') || '';
  return await serverFetch('http://localhost:4000/api/health/', {
    headers: new Headers({ cookie }),
    credentials: 'include',
    cache: 'no-store',
  });
};
