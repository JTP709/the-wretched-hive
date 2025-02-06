"use client";

import Link from 'next/link';
import { useCreateCartItem } from '@/api/server/client/mutations';

interface AddToCartButtonProps {
  productId: number;
  user: User;
}

export default function AddToCartButton({ productId, user }: AddToCartButtonProps) {
  const { mutate: addItemToCart, isPending } = useCreateCartItem();

  const handleAddToCart = async () => {
    addItemToCart(productId, {
      onSuccess: (res) => {
        if (!res.ok) {
          console.log(res)
          alert('Error adding product to cart')
        } else {
          alert('Product added to cart')
        };
      },
      onError: (err) => {
        console.error(err);
        alert('Error adding product to cart');
      },
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
