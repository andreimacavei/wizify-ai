import { ProductIntro } from "@/components/home";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";


export default async function Home() {
  const session = await getServerSession(authOptions);
  const clientKey = process.env.WIZZARD_AI_PUBLIC_CLIENT_KEY;

  if (session && session.user) {
    return <ProductIntro user={session.user} clientKey={clientKey} />;
  }


  return <ProductIntro user={undefined} clientKey={clientKey} />;
  
}
