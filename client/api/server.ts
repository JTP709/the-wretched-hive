import { redirect } from "next/navigation";

export const getCartTotal = async () => {
  const totalResponse = await fetch('http://localhost:4000/api/checkout/total', {
      credentials: 'include',
    });
  
  if (totalResponse.status === 401 || totalResponse.status === 403) {
    redirect('/login');
  }

  if (!totalResponse.ok) {
    redirect('/error');
  }

  const total: string = await totalResponse.json();

  return total;
};

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
