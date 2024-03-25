import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
export default async function UsagePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/sigin");
  }

  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5 mt-4">
      <h2 className="text-xl font-bold">Your domain statistics</h2>

    </div>
  );
}