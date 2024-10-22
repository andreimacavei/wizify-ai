import { NewDomainDialog } from "@/app/ui";

export default function SubHeader(props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) {

  return (
    <div className="flex h-28 items-center border-b border-gray-200 bg-white mb-4">
      <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl text-gray-600">
              Welcome 👋
            </h1>
          </div>
          <NewDomainDialog />
        </div>
      </div>
    </div>
  )
}
