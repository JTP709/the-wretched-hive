"use client";

import { useSignUp } from "@/api/client/mutations";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";
import reducer, { defaultState, SignUpFields } from "./reducer";

export default function SignUpForm() {
  const [message, setMessage] = useState("");
  const [state, dispatch] = useReducer(reducer, defaultState)

  const router = useRouter();
  const { mutate: postSignUp, isPending } = useSignUp();

  const {
    username,
    password,
    passwordVerify,
    email,
    firstName,
    lastName,
    streetAddress,
    streetAddressTwo,
    city,
    planet,
    postalCode,
  } = state;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (state.password !== state.passwordVerify) {
      setMessage("Passwords do not match");
      return;
    }

    postSignUp({
      username,
      password,
      email,
      firstName,
      lastName,
      streetAddress,
      streetAddressTwo,
      city,
      planet,
      postalCode,
    }, {
      onSuccess: async (res) => {
        const data = await res.json();
        if (!res.ok) setMessage(data.message)
        else router.push("/login");
      },
      onError: (err) => {
        setMessage(err?.message || "An error has occurred")
      }
    });
  };

  const handleChange = (type: SignUpFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type, payload: e.currentTarget.value })
    setMessage("");
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col">
        Username:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="ReallyCoolDude99"
          value={username}
          onChange={handleChange(SignUpFields.USERNAME)}
        />
      </label>
      Password:
      <label className="flex flex-col">
        <input
          className="my-2 text-black"
          required
          type="password"
          minLength={8}
          placeholder="pAsSw0rD!"
          value={password}
          onChange={handleChange(SignUpFields.PASSWORD)}
        />
      </label>
      <label className="flex flex-col">
        Verify Password:
        <input
          className="my-2 text-black"
          required
          type="password"
          minLength={8}
          placeholder="pAsSw0rD!"
          value={passwordVerify}
          onChange={handleChange(SignUpFields.PASSWORDVERIFY)}
        />
      </label>
      <label className="flex flex-col">
        Email:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="BobaFettsVette@hyperspace.com"
          value={email}
          onChange={handleChange(SignUpFields.EMAIL)}
        />
      </label>
      <label className="flex flex-col">
        First name:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="Han"
          value={firstName}
          onChange={handleChange(SignUpFields.FIRSTNAME)}
        />
      </label>
      <label className="flex flex-col">
        Last name:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="Solo"
          value={lastName}
          onChange={handleChange(SignUpFields.LASTNAME)}
        />
      </label>
      <label className="flex flex-col">
        Street address:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="1138 Jabba Drive"
          value={streetAddress}
          onChange={handleChange(SignUpFields.STREETADDRESS)}
        />
      </label>
      <label className="flex flex-col">
        Street address two:
        <input
          className="my-2 text-black"
          type="text"
          placeholder="Suite 500"
          value={streetAddressTwo}
          onChange={handleChange(SignUpFields.STREETADDRESSTWO)}
        />
      </label>
      <label className="flex flex-col">
        City:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="Mos Eisley"
          value={city}
          onChange={handleChange(SignUpFields.CITY)}
        />
      </label>
      <label className="flex flex-col">
        Planet:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="Tatooine"
          value={planet}
          onChange={handleChange(SignUpFields.PLANET)}
        />
      </label>
      <label className="flex flex-col">
        Postal code:
        <input
          className="my-2 text-black"
          required
          type="text"
          placeholder="01977-1983"
          value={postalCode}
          onChange={handleChange(SignUpFields.POSTALCODE)}
        />
      </label>
      <button
        className="mt-2 p-4 border-gray-500 border-2"
        type="submit"
        disabled={isPending}
      >
        Sign Up
      </button>
      { message && <p>{ message }</p>}
    </form>
  )
};
