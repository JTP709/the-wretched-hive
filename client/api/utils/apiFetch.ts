import { cookies } from 'next/headers';
import { addRefreshToken } from './shared';

const parseCookieValue  = (setCookieHeader: string | null, cookieName: string) => {
  if (!setCookieHeader) return undefined;

  const [firstPair] = setCookieHeader.split(";");
  const trimmed = firstPair.trim();
  if (trimmed.startsWith(`${cookieName}=`)) {
    return trimmed.slice(cookieName.length + 1);
  }

  return undefined;
};

export const serverFetch = async (...args: [a: RequestInfo, b: RequestInit]) => {
  const response = await addRefreshToken('http://localhost:4000/api/auth/refresh')(...args);

  const setCookieHeader = response.headers.get("set-cookie");
  const tokenValue = parseCookieValue(setCookieHeader, "XSRF-TOKEN");
  if (typeof tokenValue === 'string') {
    const appCookies = await cookies();
    appCookies.set({
        name: "XSRF-TOKEN",
        value: tokenValue,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
};
