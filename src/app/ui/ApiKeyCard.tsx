"use client";

export default function ApiKeyCard(
  { userKeys }: { userKeys: [{}] }
) {

  return (
    <>
      <div className="flex flex-col">
      {/* Header Row */}
      <div className="flex">
        <div className="flex-1 p-2 bg-gray">Key</div>
        <div className="flex-1 p-2 bg-gray">Status</div>
      </div>
        {userKeys && userKeys.map((key: any, id) => (
          // <div key={key.id} className="flex gap-4 mt-4 items-center border-gray rounded-lg border-2 bg-white p-3 pr-1 shadow hover:shadow-md sm:p-4"
          // role="listitem">
          <div key={key.id}
            // className="mt-4 flex items-center gap-4" role="listitem"
            className="flex mt-2 items-center gap-4"
          >  
          <div className="flex-1 p-2">
            <code
              className="text-sm sm:text-base inline-flex text-left items-center bg-gray-800 text-white rounded-lg">
              <p className="text-wrap rounded-md bg-graydark p-1 text-white overflow-auto">
                {key.key}
              </p>
            </code>
          </div>
          
            <div className="flex-1 p-2">
              <div className="flex flex-row items-center">
                {/* Circle indicator */}
                <span className={`inline-block mr-2 w-3 h-3 rounded-full ${key.valid ? 'bg-green-500' : 'bg-red'}`}></span>
                {/* Text */}
                <div className="flex items-center">
                {key.valid ?"Active" : "Inactive" }
                </div>
              </div>
          </div>
          
          </div>
        ))}
      </div>
    </>
  );
}
