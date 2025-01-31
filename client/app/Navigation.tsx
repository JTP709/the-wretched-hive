import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full pb-2 border-b-slate-500 border-2 border-t-0 border-x-0">
      <ul className="flex flex-row justify-between">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/cart">Cart</Link>
        </li>
      </ul>
    </nav>
  )
};
