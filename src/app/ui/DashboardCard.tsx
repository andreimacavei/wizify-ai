'use client';

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { fetchAllData } from "@/app/lib/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { ContextMenuButton, NoDomains } from "@/app/ui";
import { VerticalEllipsis } from "@/app/ui/icons"
import { deleteDomain } from "@/app/lib/actions";
import Image  from "next/image";

export default function DashboardCard() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      let data = await fetchAllData();
      setLoading(false);
      
      if (data === null) {
        setError(true);
        return;
      }
      setDomains(data);
    })();
  }, []);

  const removeDomain = async (id: number): Promise<boolean> => {
    if (domains === null) return false;

    try {
      let res = await deleteDomain(id)
      if (res) {
        // Update domains state
        let updatedDomains = domains.filter(domain => domain.id !== id)
        setDomains(updatedDomains)

        return true;
      }

    } catch (error) {
      console.error(error)
    }

    return false
  }

  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5 mt-4">
      {/* {loading && <TodaySkeleton count={3} />} */}
      {error && <div>Not logged in</div>}
      {domains && (
        <>
        {domains.length === 0 && <NoDomains />}
        {domains.length > 0 && (
          <>
            <h2 className="text-2xl font-bold">Your registrated domains</h2>
              <ul className="grid grid-cols-1 mt-4">
              {domains.map((domain) => (
                <li key={domain.id}
                  className="flex gap-4 items-center border-gray rounded-lg border-2 bg-white p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4"
                  role="listitem">
                  {/* TODO: add a preview image of website */}
                  <div className="aspect-square">
                  
                  </div>
                  <div className="grow flex gap-4 sm:items-center flex-col sm:flex-row">
                    <div className="flex flex-col grow">
                      <div className="text-lg py-2">
                        <a href={`https://${domain.hostname}`} target="_blank" rel="noreferrer" className="font-bold">{domain.hostname}</a>
                      </div>
                      <time className="hidden sm:flex gap-1 text-slate-400 text-xs">
                      <FontAwesomeIcon icon={faCalendarDays} className="w-3" />
                      {domain.createdAt.toLocaleDateString()}
                    </time>
                    </div>
                  </div>
                  <div className="self-end sm:self-center flex gap-2 items-center">
                    <div className="flex gap-1 items-center">
                      <span className="text-gray-400">Used credits:</span>
                      <span className="text-gray-400 font-bold">{domain.usage}</span>
                    </div>
                    <Suspense fallback={<VerticalEllipsis className="p-1 fill-gray-500" />}>
                      <ContextMenuButton id={domain.id} remove={removeDomain} />
                    </Suspense>
                  </div>
                </li>
              ))}
            </ul>
          </>
          )}
        </> 
      )}
      
    </div>
  )
}