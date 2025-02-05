"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage("");

    const loginResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ username, password }),
    });

    setIsPending(false);

    if (!loginResponse.ok) {
      setMessage((loginResponse as unknown as Error)?.message || "An error has occurred");
    } else {
      router.refresh();
      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  };

  const handleUsernameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handlePasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  return (
    <form 
      className="flex flex-col"
      onSubmit={handleOnSubmit}
    >
      <label className="flex flex-col">
        Username:
        <input
          className="text-black my-2"
          required
          type="text"
          value={username}
          onChange={handleUsernameOnChange}
        />
      </label>
      <label className="flex flex-col">
        Password:
        <input
          className="text-black my-2"
          required
          type="password"
          value={password}
          onChange={handlePasswordOnChange}
        />
      </label>
      <button
        className="mt-2 p-4 border-gray-500 border-2"
        type="submit"
        disabled={isPending}
      >
        Login
      </button>
      { message && <p>{ message }</p>}
    </form>
  )
};
