"use client";

import Link from 'next/link';
import { useState } from 'react';

interface AddToCartButtonProps {
  productId: number;
  user: User;
}

export default function AddToCartButton({ productId, user }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const handleAddToCart = async () => {
    setIsPending(true);
    await fetch('/api/cart', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        productId,
        quantity: 1
      }),
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        console.log(res)
        alert('Error adding product to cart')
      } else {
        alert('Product added to cart')
      };
    }).catch((err: unknown) => {
      console.error(err);
      alert('Error adding product to cart');
    }).finally(() => {
      setIsPending(false);
    });
  };

  return user?.username
    ? (
      <button
        className="my-2 border-neutral-500 border-2 p-2 cursor-pointer"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    ) : (
      <Link
        className="my-2 border-neutral-500 border-2 p-2 cursor-pointer"
        href="/login"
      >
        Log in to Add
      </Link>
    )
};
