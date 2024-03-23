import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default async function UsagePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/sigin");
  }

  return (
    <DefaultLayout>
      <h1>Usage</h1>
    </DefaultLayout>
  );
}