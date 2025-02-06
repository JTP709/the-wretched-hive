"use client";

import { useRouter } from "next/navigation";
import { useUpdateCartItemQuantity } from "@/api/client/mutations";

export default function Quantity({ cartItem }: { cartItem: CartItem }) {
  const router = useRouter();
  const { id, quantity } = cartItem;
  const { mutate: updateQuantity, isPending } = useUpdateCartItemQuantity();
  const options = {
    onSuccess (res: Response) {
      if (!res.ok ) {
        console.log(res);
        alert('Update cart failed.');
      };
    },
    onError (err: Error) {
      console.error(err);
      alert('Update cart failed.');
    },
    onSettled () {
      router.refresh();
    },
  }

  const handleDecrement = async () => {
    const newQuantity = quantity - 1;
    updateQuantity({ cartId: id, quantity: newQuantity }, options);
  };

  const handleIncrement = async () => {
    const newQuantity = quantity + 1;
    updateQuantity({ cartId: id, quantity: newQuantity }, options);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-row justify-between">
        <button className="text-xl border-2 rounded-full px-4 border-gray-500" disabled={isPending} onClick={handleDecrement}>-</button>
        <p className="text-xl mx-2">{ quantity }</p>
        <button className="text-xl border-2 rounded-full px-4 border-gray-500" disabled={isPending} onClick={handleIncrement}>+</button>
      </div>
    </div>
  )
}