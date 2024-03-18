import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      {session?.user?.email ? (
        <div>{session.user.email}</div>
      ) : (
        <div>Not logged in</div>
      )}
      Mage AI - Enhance your Web App with AI
    </>
  );
}
