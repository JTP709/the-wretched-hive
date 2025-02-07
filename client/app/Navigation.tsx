import Link from "next/link";
import LogInOutBtn from "./LogInOutBtn";
import { getUser } from "@/api/server";
import Image from "next/image";

export default async function Navigation() {
  const user = await getUser();
    
  return (
    <nav className="w-full pb-2 border-b-slate-500 border-2 border-t-0 border-x-0">
      <div className="flex flex-row justify-between">
        <ul className="flex flex-row">
          <li className="mr-2">
            <Link className="flex flex-row" href="/">
              Home
              <Image className="ml-2" src="/home.svg" alt="home" width="24" height="24" />
            </Link>
          </li>
          <li className="mr-2">
            <Link className="flex flex-row" href="/cart">
              Cart
              <Image className="ml-2" src="/cart.svg" alt="cart" width="24" height="24" />
            </Link>
          </li>
        </ul>
        <LogInOutBtn user={user} />
      </div>
    </nav>
  );
};
