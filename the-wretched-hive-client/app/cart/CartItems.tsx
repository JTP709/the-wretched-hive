import Link from "next/link";
import Quantity from "./Quantity";

export default async function CartItems() {
  const cartResponse = await fetch('http://localhost:4000/api/cart');
  const cart: CartItem[] = await cartResponse.json();

  return ( 
    <div>
      {cart.map((cartItem: CartItem, i: number) => (
        <div key={cartItem.id}>
          <div className="flex flex-row justify-between">
            <Link href={`/products/${cartItem.productId}`}>
              <h1 className="font-bold mb-2 mr-12">{cartItem.name}</h1>
            </Link>
            <p>${cartItem.price}</p>
          </div>
          <Quantity cartItem={cartItem} />
          { i !== cart.length - 1 && <hr className="my-4" /> }
        </div>
      ))}
    </div>
  );
};
