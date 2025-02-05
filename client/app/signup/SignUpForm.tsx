"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage("");
    if (password !== passwordVerify) {
      setMessage("Passwords do not match");
      return;
    }

    await fetch("http://localhost:4000/api/auth/signup",{
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        username,
        password
      })
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) setMessage(data.message)
      router.push("/login");
      return data;
    })
      .catch(err => setMessage(err.response.data.message || "An error has occurred"))
      .finally(() => setIsPending(false));
  };

  const handleUsernameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
    setMessage("");
  };

  const handlePasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
    setMessage("");
  };

  const handlePasswordVerifyOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordVerify(e.currentTarget.value);
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
          onChange={handleUsernameOnChange}
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
          onChange={handlePasswordOnChange}
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
          onChange={handlePasswordVerifyOnChange}
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
