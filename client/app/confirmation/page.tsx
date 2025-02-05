import { getCheckoutTotal } from "@/api/server";

interface ConfirmationProps {
  searchParams: {
    orderId: string,
  }
}

export default async function Confirmation({ searchParams }: ConfirmationProps) {
  const { orderId } = await searchParams;
  const total = await getCheckoutTotal(orderId);

  return (
    <div className="flex flex-col justify-center">
      <h1 className="font-bold text-xl">Congratulations!</h1>
      <h2 className="my-4">Your purchase is complete.</h2>
      <p className="font-bold">You paid ${ total }</p>
    </div>
  )
};
