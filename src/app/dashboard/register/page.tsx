import React from "react";
import RegisterDomains from "@/components/RegisterDomains";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/sigin");
  }

  return (
    <DefaultLayout>
      <RegisterDomains />
    </DefaultLayout>
  );
}