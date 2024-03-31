import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import ApiKeyCard from "@/app/ui/ApiKeyCard";
import { fetchUserApiKeys } from "@/app/lib/data";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/signin");
  }

  const userKeys = await fetchUserApiKeys();

  return (
    <div className="col-span-1 mt-4 auto-rows-min grid-cols-1 lg:col-span-5">
      <h2 className="text-center text-xl font-semibold">Your API keys</h2>
      {userKeys && userKeys.length > 0 && <ApiKeyCard userKeys={userKeys} />}
      <div className="mt-12">
        <p className="text-center text-lg font-semibold">
          Include the next script to your website and start using Wizzard AI .
        </p>
        <p className="mt-2 overflow-auto text-wrap rounded-md bg-graydark p-4 text-lg text-white">
          {userKeys &&
            userKeys.length > 0 &&
            `<script src="http://wizzard.vercel.app/widget.js?client_key=${userKeys[0].key}"></script>`}
          {!userKeys ||
            (userKeys.length === 0 && (
              <span className="text-red-500">
                You don't have any API keys yet.
              </span>
            ))}
        </p>
      </div>
    </div>
  );
}
