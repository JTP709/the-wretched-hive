import Link from "next/link";

export default async function Products() {
  const products = await fetch('http://localhost:4000/api/products')
    .then(res => res.json());

  return (
    <div>
      {products.map((product: Product, i: number) => (
        <div key={product.id}>
          <h1>{product.name}</h1>
          <p>{product.category}</p>
          <p>{product.description}</p>
          <p>{product.price}</p>
          <Link href={`/products/${product.id}`}>Product Info</Link>
          { i !== products.length - 1 && <hr /> }
        </div>
      ))}
    </div>
  )
};

