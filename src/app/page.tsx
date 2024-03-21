import { ProductIntro } from "@/components/home";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session && session.user) {
    return <ProductIntro user={session.user} />;
  }


  return (
    <>
      <ProductIntro user={undefined} />;
      </>
  )
  
}
