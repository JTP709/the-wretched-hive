import Link from "next/link";
import LogoutBtn from "./LogoutBtn";

export default function Navigation() {
  return (
    <nav className="w-full pb-2 border-b-slate-500 border-2 border-t-0 border-x-0">
      <div className="flex flex-row justify-between">
        <ul className="flex flex-row">
          <li className="mr-2">
            <Link href="/">Home</Link>
          </li>
          <li className="mr-2">
            <Link href="/cart">Cart</Link>
          </li>
        </ul>
        <LogoutBtn />
      </div>
    </nav>
  )
};
