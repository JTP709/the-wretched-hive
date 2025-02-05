"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutBtnProps {
  user: User;
}

export default function LogoutBtn({ user }: LogoutBtnProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);

    await fetch('/api/auth/logout', {
      method: "POST",
      credentials: 'include',
    }).then(res => {
      if (!res.ok) alert('An error has occurred');
      else router.push('/login');
    }).catch(err => {
      console.error(err);
      alert(err.message || 'An error has occurred');
    }).finally(() => setIsPending(false));
  };

  return user?.username
    ? (
      <button className="flex flex-row" onClick={handleLogout} disabled={isPending}>
        Log out
        <Image className="ml-2" src="/logout.svg" alt="log out" width="24" height="24" />
      </button>
    ) : (
      <Link href="/login">Login</Link>
    )
};
