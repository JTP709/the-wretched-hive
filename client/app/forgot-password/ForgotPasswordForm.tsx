"use client";

import { useForgotPassword } from "@/api/client/mutations";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
    setMessage("");
  };

  const { mutate: requestPasswordReset, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestPasswordReset({ email }, {
      onSuccess: () => setRequestSent(true),
      onError: (err: Error) => setMessage(err?.message || "An issue has occurred"),
    });
  };

  return requestSent
    ? (
      <div>
        <p>An email has been send to { email } with a link to reset your password.</p>
        <br />
        <p>
          If you have not received your email within five minutes,{' '}
          <button onClick={() => setRequestSent(false)}>click here to try again</button>
        </p>
        <br />
        <Link href="/login">Click here to go back to log in</Link>
      </div>
    ) : (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label className="flex flex-col">
        Email:
        <input
          className="text-black my-2"
          required
          type="text"
          placeholder="youremail@email.com"
          value={email}
          onChange={handleEmailChange}
        />
      </label>
      <button
        className="mt-2 p-4 border-gray-500 border-2"
        type="submit"
        disabled={isPending}
      >
        Send email
      </button>
      { message && <p>{ message }</p>}
    </form>
  )
};
