import Link from "next/link";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <h1 className="font-bold text-xl">Sign Up</h1>
      <SignUpForm />
      <p>
        Already have an account?
        <br />
        <Link href="/login">Click here to log in</Link>
      </p>
    </>
  )
};
