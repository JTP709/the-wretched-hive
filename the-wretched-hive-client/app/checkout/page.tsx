import CheckoutForm from "./CheckoutForm";

export default async function Checkout() {
  const total: string = await fetch('http://localhost:4000/api/checkout/total')
    .then(res => {
      if (res.status >= 400) {
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
    <div>
      <h1>Checkout</h1>
      <p>Total: { total }</p>
      <CheckoutForm total={total} />
    </div>
  )
};

