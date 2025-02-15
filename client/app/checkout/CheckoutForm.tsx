"use client";

import { useCheckout } from "@/api/client/mutations";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  total: string;
  user: User;
}

export default function CheckoutForm({ total, user }: CheckoutFormProps) {
  console.log({ user })
  const router = useRouter();
  const { mutateAsync: checkout, isPending } = useCheckout();

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

    const checkoutResponse = await checkout(formDataJSON);

    if (checkoutResponse.status === 403) {
      router.push("/login");
    } else if (!checkoutResponse.ok) {
      const response = await checkoutResponse.json();
      alert(response?.message || 'There was an issue while trying to complete your purchase.');
    } else {
      router.push(`/confirmation?total=${total}`);
    }
  };

  return (
    <form
      className="flex flex-col w-full"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col mb-4">
        Name:
        <input className="text-black" required type="text" name="name" defaultValue={`${user.firstName} ${user.lastName}`}></input>
      </label>
      <label className="flex flex-col mb-4">
        Email:
        <input className="text-black" required type="text" name="email" defaultValue={user.email}></input>
      </label>
      <label className="flex flex-col mb-4">
        Street Address:
        <input className="text-black" required type="text" name="streetAddress" defaultValue={user.streetAddress}></input>
      </label>
      <label className="flex flex-col mb-4">
        Street Address Line Two {'(optional)'}:
        <input className="text-black" type="text" name="streetAddressTwo" defaultValue={user.streetAddressTwo}></input>
      </label>
      <label className="flex flex-col mb-4">
        City:
        <input className="text-black" required type="text" name="city" defaultValue={user.city}></input>
      </label>
      <label className="flex flex-col mb-4">
        Planet:
        <input className="text-black" required type="text" name="planet" defaultValue={user.planet}></input>
      </label>
      <label className="flex flex-col mb-4">
        Postal Code:
        <input className="text-black" required type="text" name="postalCode" defaultValue={user.postalCode}></input>
      </label>
      <label className="flex flex-col mb-4">
        Commlink Number:
        <input className="text-black" required type="text" name="phone" defaultValue={""}></input>
      </label>
      <button 
        className="mt-4 border-neutral-500 border-2 p-2 cursor-pointer"
        type="submit"
        disabled={isPending}
      >
        Pay
      </button>
    </form>
  )
}
