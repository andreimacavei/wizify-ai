import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session?.user?.email ? (
        <div>Hello user with email {session.user.email}!</div>
      ) : (
        <div>Not logged in</div>
      )}
      Mage AI - Enhance your Web App with AI
    </>
  );
}
