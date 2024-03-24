
import NewDomain from '@/components/RegisterDomains';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export default async function NewDomainPage() {
	const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/sigin");
  }

  return (
		<DefaultLayout>
			<NewDomain />
      </DefaultLayout>
	)
}