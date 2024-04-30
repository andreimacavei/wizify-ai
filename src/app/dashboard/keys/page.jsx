import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { ApiKeyCard, NewKeyDialog } from "@/app/ui";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <>
      <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
        <h2 className="text-center text-3xl font-bold">Your API Keys</h2>
        <h3 className="text-gray-200 mt-4 text-center">
          Here you can manage your LLM Keys
        </h3>
        <ApiKeyCard />
        <NewKeyDialog />
      </div>
    </>
  );
}
