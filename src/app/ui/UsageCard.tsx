'use client';
import { ProgressBar } from '@/app/ui';
import { useEffect, useState } from 'react';
import { set } from 'zod';

export default function UsageCard() {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      // Fetch credits from the server

      setLoading(false)

      setCredits(1500)
    })()
  }, [])

  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5 mt-4">
      {/* <div className="bg-white shadow-md rounded-md p-6"> */}
      <div className="flex gap-4 mt-4 items-center border-gray rounded-lg border-2 bg-white p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4"
              role="listitem">
        
        <div className="mt-6">
          <ProgressBar progress={50} label="50% used" />
        </div>
        <div className="grow flex gap-4 sm:items-center flex-col sm:flex-row">
          <p className="text-gray-400">You have used 1500 credits out of 3000.</p>
          <p className="text-gray-400">You have 1500 credits left.</p>
        </div>
      </div>
    </div>

  );
}