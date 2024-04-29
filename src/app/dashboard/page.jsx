import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";
import { fetchUserClientKeys, fetchUserDomains } from "@/app/lib/data";
import DashboardCard from "@/app/ui/DashboardCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/signin");
  }
  const userKeys = await fetchUserClientKeys();
  const widgetPublicUrl = process.env.WIZZARD_AI_WIDGET_HOST_URL;
  const scriptText = `<script src="${widgetPublicUrl}/widget.js?client_key=${userKeys[0].key}"></script>`;
  // TODO fetch here domains and pass to children
  // const userDomains = await fetchUserDomains();

  return <DashboardCard scriptText={scriptText} />;
}
