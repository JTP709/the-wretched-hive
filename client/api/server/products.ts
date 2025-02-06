import { serverFetch } from "../utils/apiFetch";

export const getProducts = async (page?: string, search?: string) => {
  const pageNum = page || '1';
  const searchParam: { search: string } | object = search ? { search } : {}
  const params = { page: pageNum, limit: '5', ...searchParam };
  const queryParams = new URLSearchParams(params).toString();

  const productsResponse = await serverFetch(`http://localhost:4000/api/products?${queryParams}`, {
    credentials: 'include',
  });
  const products = await productsResponse.json();
  
  return products;
};

export const getProductDetails = async (id: string) => {
  const productResponse = await serverFetch(`http://localhost:4000/api/products/${id}`);
  const product: Product = await productResponse.json();
  
  return product;
};
