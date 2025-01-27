import Quantity from "./Quantity";

export default async function CartItems() {
  const cartResponse = await fetch('http://localhost:4000/api/cart');
  const cart: CartItem[] = await cartResponse.json();

  return ( 
    <div>
      {cart.map((cartItem: CartItem) => (
        <div key={cartItem.id}>
          <h1>{cartItem.name}</h1>
          <p>{cartItem.description}</p>
          <p>{cartItem.price}</p>
          <Quantity cartItem={cartItem} />
        </div>
      ))}
    </div>
  );
};
