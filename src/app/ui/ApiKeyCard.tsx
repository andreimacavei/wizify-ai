"use client";

import React from "react";

export default function ApiKeyCard(
  { userKeys }: { userKeys: [{}] }
) {

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] gap-4">
      {/* Header Row */}
        <div className="p-2 bg-gray">Key</div>
        <div className="p-2 bg-gray">Status</div>
    
        {userKeys && userKeys.map((key: any, id) => (

          <React.Fragment key={key.id}>
            <div className="p-2 overflow-x-auto">
              <code
                className="block text-sm sm:text-base bg-gray-800 text-white rounded-lg overflow-x-auto whitespace-normal break-words"
              >
                <span
                  className="block rounded-md bg-graydark p-1 "
                >
                  {key.key}
                </span>
              </code>
            </div>
            
            <div className="p-2 flex items-center justify-start">
              {/* Circle indicator */}
              <span className={`inline-block mr-2 w-3 h-3 rounded-full ${key.valid ? 'bg-green-500' : 'bg-red'}`}></span>
              {/* Text */}
              <div className="flex items-center">
              {key.valid ?"Active" : "Inactive" }
              </div>
            </div>
          </React.Fragment>
          // </div>
        ))}
      </div>
    </>
  );
}
