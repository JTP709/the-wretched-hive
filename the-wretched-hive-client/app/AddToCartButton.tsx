"use client";

import { useState } from 'react';

interface AddToCartButtonProps {
  productId: number;
};

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const handleAddToCart = async () => {
    setIsPending(true);
    await fetch('http://localhost:4000/api/cart', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        productId,
        quantity: 1
      }),
    }).then((res) => {
      if (res.status >= 400) {
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

  return (
    <button
      className="my-2 border-neutral-500 border-2 p-2 cursor-pointer"
      disabled={isPending}
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  )
};
