import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Products

export const getProducts = async (page?: string) => {
  const pageNum = page || '1';
  const queryParams = new URLSearchParams({ page: pageNum, limit: '5' }).toString();
  const productsResponse = await fetch(`http://localhost:4000/api/products?${queryParams}`, {
    credentials: 'include',
  });
  const products = await productsResponse.json();
  
  return products;
}

export const getProductDetails = async (id: string) => {
  const productResponse = await fetch(`http://localhost:4000/api/products/${id}`);
  const product: Product = await productResponse.json();
  
  return product;
}

// Cart Items AUTHENTICATED

export const getCartTotal = async () => {
  const incomingHeaders = headers();
  const cookie = (await incomingHeaders).get('cookie') || '';
  const totalResponse = await fetch('http://localhost:4000/api/checkout/total', {
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
  const cartResponse = await fetch('http://localhost:4000/api/cart', {
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
