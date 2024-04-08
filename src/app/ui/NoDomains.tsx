import { NewDomainDialog, Stepper } from "@/app/ui";

export default function NoDomains() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      
      <div className="text-center">
        <h2 className="text-3xl font-bold">No Domains</h2>
        <p className="text-gray-500 font-semibold mt-8 mb-8">You haven't added any domains yet.</p>
      </div>
      <NewDomainDialog />
      <Stepper />
    </div>
  );
}