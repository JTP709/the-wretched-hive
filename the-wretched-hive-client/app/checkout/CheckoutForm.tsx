"use client";

import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  total: string;
}

export default function CheckoutForm({ total }: CheckoutFormProps) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const address = form.elements.namedItem('name') as HTMLInputElement;
    const phone = form.elements.namedItem('name') as HTMLInputElement;

    if (!name.value.trim() || !email.value.trim() || !address.value.trim() || !phone.value.trim()) {
      alert('The form is incomplete');
      return;
    }
  
    const formData = new FormData(form);
    const formDataJSON = Object.fromEntries(formData.entries());
    formDataJSON.total = total;

    await fetch('http://localhost:4000/api/checkout', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(formDataJSON),
    }).then((res) => {
      if (!res.ok) {
        alert('There was an issue while trying to complete your purchase.');
      } else {
        router.push(`/confirmation?total=${total}`);
      }
    }).catch((err) => {
      console.error(err);
      alert('There was an issue while trying to complete your purchase.');
    })
  };

  return (
    <form
      className="flex flex-col w-full"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col mb-4">
        Name
        <input className="text-black" required type="text" name="name"></input>
      </label>
      <label className="flex flex-col mb-4">
        Email
        <input className="text-black" required type="text" name="email"></input>
      </label>
      <label className="flex flex-col mb-4">
        Address
        <input className="text-black" required type="text" name="address"></input>
      </label>
      <label className="flex flex-col mb-4">
        Phone Number
        <input className="text-black" required type="text" name="phone"></input>
      </label>
      <button 
        className="mt-4 border-neutral-500 border-2 p-2 cursor-pointer"
        type="submit"
      >
        Pay
      </button>
    </form>
  )
}