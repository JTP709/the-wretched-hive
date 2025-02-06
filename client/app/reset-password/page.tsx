import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPassword() {
  return (
    <>
      <h1 className="font-bold text-xl">Reset Password</h1>
      <ResetPasswordForm />
      <p>
        <Link href="/forgot-password">Click here to request a new email</Link>
      </p>
      <p>
        <Link href="/login">Click here to return to log in</Link>
      </p>
    </>
  )
};
