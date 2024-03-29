"use client";

export default function ApiKeyCard(
  { userKeys }: { userKeys: [{}] }
) {

  return (
    <>
      {userKeys && userKeys.map((key: any) => (
          // <div key={key.id} className="flex gap-4 mt-4 items-center border-gray rounded-lg border-2 bg-white p-3 pr-1 shadow hover:shadow-md sm:p-4"
          // role="listitem">
          <div key={key.id} className="flex items-center gap-4" role="listitem">
            <div>
              <p className="mt-4 text-wrap rounded-md bg-graydark p-4 text-white overflow-auto">
              {key.key}
            </p> 
            </div>
            <div className="ml-4">
              <span className="text-2xl font-bold text-green-400">Active</span>
            </div>
          </div>
        
          // </div>
        ))}
      
    </>
  );
}
