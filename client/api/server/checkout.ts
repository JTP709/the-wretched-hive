import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { serverFetch } from "../utils/apiFetch";

export const getCheckoutTotal = async (orderId: string) => {
  const incomingHeaders = headers();
  const cookie = (await incomingHeaders).get('cookie') || '';
  const totalResponse = await serverFetch(`http://localhost:4000/api/checkout/total/${orderId}`, {
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
