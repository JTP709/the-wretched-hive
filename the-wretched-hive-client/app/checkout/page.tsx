import CheckoutForm from "./CheckoutForm";

export default async function Checkout() {
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
        <h1 className="font-bold text-xl mr-16">Checkout</h1>
        <p className="font-bold text-xl">Total: ${ total }</p>
      </div>
      <CheckoutForm total={total} />
    </>
  )
};

