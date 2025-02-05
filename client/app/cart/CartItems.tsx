import Link from "next/link";
import Quantity from "./Quantity";
import { getCartItems } from "@/api/server";

export default async function CartItems() {
  const cart = await getCartItems();

  return ( 
    <div>
      {cart?.map((cartItem: CartItem, i: number) => (
        <div key={cartItem.id}>
          <div className="flex flex-row justify-between">
            <Link href={`/products/${cartItem.productId}`}>
              <h1 className="font-bold mb-2 mr-12">{cartItem.product.name}</h1>
            </Link>
            <p>${cartItem.product.price}</p>
          </div>
          <Quantity cartItem={cartItem} />
          { i !== cart.length - 1 && <hr className="my-4" /> }
        </div>
      ))}
    </div>
  );
};
