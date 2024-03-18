'use client';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
      <Link href="/login">Login</Link>
    );
}

export default function NavMenu() {
  return (
    <div>
      <AuthButton />
    </div>
  )
}