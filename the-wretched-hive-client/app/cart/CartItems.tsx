export default async function CartItems() {
  const cart = await fetch('http://localhost:4000/api/cart')
    .then(res => res.json());

  return ( 
    <div>
      {cart.map((product: Product) => (
        <div key={product.id}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
};
