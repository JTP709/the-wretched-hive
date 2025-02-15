import CheckoutForm from "./CheckoutForm";
import { getCartTotal, getUser } from "@/api/server";

export default async function Checkout() {
  const total = await getCartTotal();
  const user = await getUser();

  return (
    <>
      <div className="flex flex-row w-full justify-between">
        <h1 className="font-bold text-xl mr-16">Checkout</h1>
        <p className="font-bold text-xl">Total: ${ total }</p>
      </div>
      <CheckoutForm total={total} user={user} />
    </>
  )
};

