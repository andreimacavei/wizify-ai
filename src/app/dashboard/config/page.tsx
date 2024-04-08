import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { ConfigCard } from "@/app/ui";

export default async function ConfigPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    redirect('/')
  const { user } = session


  return <ConfigCard/>
}