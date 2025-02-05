import Link from "next/link";
import Quantity from "./Quantity";
import { redirect } from "next/navigation";

export default async function CartItems() {
  const cart = await fetch('http://localhost:4000/api/cart', {
    credentials: 'include',
  }).then(res => {
    if (res.status === 401 || res.status === 403) {
      redirect('/login');
    } else if (!res.ok) {
      console.log('There was an issue fetching cart items', res);
      redirect('/error');
    } else {
      return res.json();
    }
  });

  return ( 
    <div>
      {cart?.map((cartItem: CartItem, i: number) => (
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
