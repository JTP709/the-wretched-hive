import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { serverFetch } from "../utils/apiFetch";

export const getCartTotal = async () => {
  const incomingHeaders = headers();
  const cookie = (await incomingHeaders).get('cookie') || '';
  const totalResponse = await serverFetch('http://localhost:4000/api/cart/total', {
    headers: new Headers({ cookie }),
    credentials: 'include',
  });
  
  if (totalResponse.status === 401 || totalResponse.status === 403) {
    redirect('/login');
  }

  if (!totalResponse.ok) {
    redirect('/error');
  }

  const data = await totalResponse.json();

  return data?.total || 0;
};

export const getCartItems = async () => {
  const incomingHeaders = headers();
  const cookie = (await incomingHeaders).get('cookie') || '';
  const cartResponse = await serverFetch('http://localhost:4000/api/cart', {
    headers: new Headers({ cookie }),
    credentials: 'include',
  });
  
  if (cartResponse.status === 401 || cartResponse.status === 403) {
    redirect('/login');
  }

  if (!cartResponse.ok) {
    redirect('/error');
  }

  const cart = await cartResponse.json();

  return cart;
};