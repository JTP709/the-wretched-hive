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

    const logoutResponse = await fetch('/api/auth/logout', {
      method: "POST",
      credentials: 'include',
    });

    setIsPending(false);

    if (!logoutResponse.ok) alert('An error has occurred');
    else router.refresh();
  };

  return user?.username
    ? (
      <button className="flex flex-row" onClick={handleLogout} disabled={isPending}>
        Log out
        <Image className="ml-2" src="/logout.svg" alt="log out" width="24" height="24" />
      </button>
    ) : (
      <Link className="flex flex-row" href="/login">
        Log in
        <Image className="ml-2" src="/login.svg" alt="log in" width="24" height="24" />
      </Link>
    )
};
