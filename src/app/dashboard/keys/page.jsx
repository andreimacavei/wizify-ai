import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import ApiKeyCard from "@/app/ui/ApiKeyCard";
import { fetchUserApiKeys } from "@/app/lib/data";
import CopyToClipboardButton from "@/app/ui/CopyToClipboardButton";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/signin");
  }

  const userKeys = await fetchUserApiKeys();
  const wizzardUrl = process.env.WIZZARD_AI_PUBLIC_URL;
  // const scriptText = `<script src="${wizzardUrl}/widget.js?client_key=${userKeys[0].key}"></script>`;

  return (
    <div className="col-span-1 mt-4 auto-rows-min grid-cols-1 lg:col-span-5">
      <h2 className="text-left text-xl font-semibold">Your CLIENT keys</h2>
      {userKeys && userKeys.length > 0 && <ApiKeyCard userKeys={userKeys} />}

      <div className="mt-12">
        {!userKeys ||
          (userKeys.length === 0 && (
            <p className="text-red">You don't have any API keys yet.</p>
          ))}
        {/* {userKeys && userKeys.length > 0 && (
          <h2 className="mt-2 text-left text-xl font-semibold">
            Copy the following script and paste it into your website's HTML
            code.
          </h2>
        )} */}
        {/* {userKeys && userKeys.length > 0 && scriptText && (
          <div className="mt-4 overflow-auto rounded-lg bg-graydark">
            <div className="flex p-1">
              <CopyToClipboardButton scriptText={scriptText} />
            </div>
            <div className="px-3 py-2">
              <pre className="language-xml">
                <code className="text-sm ">{scriptText}</code>
              </pre>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
