import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";
import { fetchUserDomains } from "@/app/lib/data";
import DashboardCard from "@/app/ui/DashboardCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/signin");
  }

  const userDomains = await fetchUserDomains();

  return <DashboardCard userDomains={userDomains} />;
}
