import React from "react";
import RegisterDomains from "@/components/RegisterDomains";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth";


export default async function RegisterPage() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <DefaultLayout>
      <RegisterDomains />
    </DefaultLayout>
  );
}