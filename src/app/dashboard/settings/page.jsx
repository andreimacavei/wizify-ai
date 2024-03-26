"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <div className="col-span-1 mt-4 auto-rows-min grid-cols-1 lg:col-span-5">
      <h2 className="text-xl font-bold">Settings</h2>
      <div className="mt-4">
        <p className="text-lg">
          Use Wizzard AI on your website/webapp by adding this JS.
        </p>
        <pre className="mt-4 text-wrap rounded-md bg-graydark p-4 text-xs text-white">
          {`<script src="http://wizzard.vercel.app/widget.js" ></script>`}
        </pre>
      </div>
    </div>
  );
}
