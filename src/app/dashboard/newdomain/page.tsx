
import NewDomain from '@/components/RegisterDomains';
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export default async function NewDomainPage() {
	const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <NewDomain />
	)
}