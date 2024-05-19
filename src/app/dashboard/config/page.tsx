import { useState } from 'react';
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import ConfigWidgetUsageCard from "@/app/ui/ConfigWidgetUsageCard";

export default async function ConfigPage() {

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/signin");
  }

  console.log('Config Page - Session data is ', session.user);

  return <ConfigWidgetUsageCard userId={session.user.id} />;

}
