import Link from "next/link";
import CartItems from "./CartItems";

export default async function Cart() {
  const total: string = await fetch('http://localhost:4000/api/checkout/total')
    .then(res => {
      if (!res.ok) {
        console.log(res);
        alert('There was an issue fetching the cart total');
      } else {
        return res.json()
      }
    })
    .then(data => data.total)
    .catch((err) => {
      console.error(err);
      alert('There was an issue fetching the cart total');
    });

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