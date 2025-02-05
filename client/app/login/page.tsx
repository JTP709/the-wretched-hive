import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="font-bold text-xl">Login</h1>
      <LoginForm />
      <p>
        Don&apos;t have an account?
        <br />
        <Link href="/signup">Click here to sign up</Link>
      </p>
    </>
  );
};
