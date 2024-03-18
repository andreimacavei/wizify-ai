'use client'

import { signOut } from "next-auth/react"

export default function Logout() {
  return (
    <span>
      <button onClick={() => signOut()}>Logout</button>
    </span>
  )
}