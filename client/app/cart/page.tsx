import Link from "next/link";
import CartItems from "./CartItems";
import { getCartTotal } from "@/api/server";

export default async function Cart() {
  const total = await getCartTotal();

  return (
    <>
      <div className="flex flex-row w-full justify-between">
        <h1 className="font-bold text-xl">Cart</h1>
        <p className="font-bold text-xl">Total: ${ total }</p>
      </div>
      <CartItems />
      <div className="flex flex-row w-full justify-center">
        <Link
          className="my-2 border-neutral-500 border-2 p-2 cursor-pointer"
          href="/checkout"
        >
          Go to Checkout
        </Link>
      </div>
    </>
  );
}