import { NewDomainDialog } from "@/app/ui";

export default function NoDomains({ wizifyUrl }) {
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      
      <div className="text-center">
        <h2 className="text-3xl font-bold">No Domains</h2>
        <p className="text-gray-500 font-semibold mt-8 mb-8">You haven't added any domains yet.</p>
      </div>
      <NewDomainDialog />
      <div className="text-slate-500 mt-4 text-sm text-center"> Need to learn more about this?
        <br />
        <a href={`${wizifyUrl}/integration`} target="_blank" rel="noreferrer" className="text-blue-500">
          Read here
        </a>
      </div>
    </div>
  );
}