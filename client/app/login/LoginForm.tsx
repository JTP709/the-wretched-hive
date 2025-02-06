"use client";

import { useLogin } from "@/api/client/mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const loginResponse = await login({ username, password });

    if (!loginResponse.ok) {
      const data = await loginResponse.json();
      setMessage(data?.message || "An error has occurred");
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
