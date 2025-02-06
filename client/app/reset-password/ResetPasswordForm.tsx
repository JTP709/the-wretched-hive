"use client";

import { useResetPassword } from "@/api/client/mutations";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") as string;

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== verifyPassword) {
      setMessage("Password does not match");
      return;
    }
    resetPassword({ password, token }, {
      onSuccess: async (res) => {
        if (!res.ok) {
          const data = await res.json();
          setMessage(data?.message || "An issue has occurred");
        } else {
          router.push("/login")
        }
      },
      onError: (err) => {
        setMessage(err?.message || "An issue has occurred");
      }
    })
  };

  const handlePasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
    setMessage("");
  };

  const handleVerifyPasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyPassword(e.currentTarget.value);
    setMessage("");
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label className="flex flex-col">
        New Password:
        <input
          className="text-black my-2"
          required
          type="password"
          placeholder="sTr0nG_p@sSw0rD!"
          value={password}
          onChange={handlePasswordOnChange}
        />
      </label>
      <label className="flex flex-col">
        Verify New Password:
        <input
          className="text-black my-2"
          required
          type="password"
          placeholder="sTr0nG_p@sSw0rD!"
          value={verifyPassword}
          onChange={handleVerifyPasswordOnChange}
        />
      </label>
      <button
        className="mt-2 p-4 border-gray-500 border-2"
        type="submit"
        disabled={isPending}
      >
        Reset password
      </button>
      { message && <p>{ message }</p>}
    </form>
  )
};
