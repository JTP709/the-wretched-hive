"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Quantity({ cartItem }: { cartItem: CartItem }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { id, quantity } = cartItem;

  const handleDecrement = async () => {
    setIsPending(true);
    await fetch(`http://localhost:4000/api/cart/${id}`, {
      method: 'PUT',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ quantity: quantity - 1 }),
    }).then((res) => {
      if (res.status >= 400 ) {
        console.log(res);
        alert('Update cart failed.');
      };
    }).catch((err) => {
      console.error(err);
      alert('Update cart failed.');
    }).finally(() => {
      setIsPending(false);
      router.refresh();
    });
  };

  const handleIncrement = async () => {
    setIsPending(true);
    await fetch(`http://localhost:4000/api/cart/${id}`, {
      method: 'PUT',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ quantity: quantity + 1 }),
    }).then((res) => {
      if (res.status >= 400 ) {
        console.log(res);
        alert('Update cart failed.');
      };
    }).catch((err) => {
      console.error(err);
      alert('Update cart failed.');
    }).finally(() => {
      setIsPending(false);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-row w-12 justify-between">
      <button disabled={isPending} onClick={handleDecrement}>-</button>
      <p>{ quantity }</p>
      <button disabled={isPending} onClick={handleIncrement}>+</button>
    </div>
  )
}