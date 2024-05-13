import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { ProductIntro } from "@/components/home";

export default async function DemoPage() {
  const session = await getServerSession(authOptions);
  const clientKey = process.env.WIZZARD_AI_PUBLIC_CLIENT_KEY;

  return <ProductIntro user={session && session.user} clientKey={clientKey} />;
}
