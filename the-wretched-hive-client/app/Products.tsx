import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import Pagination from "./Pagination";
// import Image from "next/image";

interface ProductsProps {
  page: string,
}

export default async function Products({ page }: ProductsProps) {
  const limit = '5';
  const queryParams = new URLSearchParams({ page, limit }).toString();

  const productsResponse = await fetch(`http://localhost:4000/api/products?${queryParams}`)
    .then(res => res.json());

  const { data: products, page: currentPage, totalPages } = productsResponse;

  return (
    <div>
      {products.map((product: Product, i: number) => (
        <div key={product.id}>
          <div className="mb-4 flex flex-row justify-between">
            <div>
              <h1 className="font-bold">{product.name}</h1>
              <p>{product.category}</p>
            </div>
            <p>${product.price}</p>
          </div>
          <div className="flex flex-row">
            <Link href={`/products/${product.id}`}>
              {/* <Image src={`/${product.image}`} alt={`${product.name} image`}/> */}
              <img src="https://placehold.co/128x128" alt={`${product.name} image`} />
            </Link>
            <div className="ml-4 w-full">
              <p>{product.description}</p>
              <div className="w-full flex justify-end align-bottom">
                <AddToCartButton productId={product.id} />
              </div>
            </div>
          </div>
          <br />
          { i !== products.length - 1 && <hr className="mb-4" /> }
        </div>
      ))}
      <Pagination totalPages={Number(totalPages)} currentPage={Number(currentPage)} />
    </div>
  )
};
