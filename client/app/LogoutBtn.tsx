"use client";

import { useLogout } from "@/api/client/mutations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LogoutBtnProps {
  user: User;
}

export default function LogoutBtn({ user }: LogoutBtnProps) {
  const router = useRouter();
  const { mutateAsync: logout, isPending } = useLogout();

  const handleLogout = async () => {

    const logoutResponse = await logout();

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
