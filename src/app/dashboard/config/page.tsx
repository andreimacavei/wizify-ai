import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { ConfigWidget } from "@/app/ui";

export default async function ConfigPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    redirect('/')
  const { user } = session

  return (
    <>
      <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
        <h2 className="text-3xl text-center font-bold">Configuration</h2>
      
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center mt-4">
            <h3 className="text-xl font-semibold">Welcome {user.name}</h3>
            <p className="text-sm text-gray-500">Here you can configure your settings</p>
          </div>
        </div>

        <ConfigWidget />
      </div>
    </>
    
  )
}