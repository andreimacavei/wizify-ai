"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <DefaultLayout>
      <h1>Settings</h1>
    </DefaultLayout>
  );
}
