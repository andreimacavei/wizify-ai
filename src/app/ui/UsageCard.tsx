'use client';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link'
import { getUserApiKeys } from '@/app/lib/actions';
import { fetchUserUsageData } from '@/app/lib/data';
import { CircularProgressbar } from 'react-circular-progressbar';
import { KeyContext } from '@/app/context';
import 'react-circular-progressbar/dist/styles.css';

export default function UsageCard({ userId }) {
  const [usedCredits, setUsedCredits] = useState(0)
  const [subscriptionCredits, setSubscriptionCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const { keys, setKeys } = useContext(KeyContext);
  const [plan, setPlan] = useState({
    name: '',
    creditsPerMonth: 0,
    domainsAllowed: 0
  })

  useEffect(() => {
    (async () => {  
    let data = await getUserApiKeys(userId);
      setKeys(data)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      setLoading(true)
      // Fetch user data from the server
      let data = await fetchUserUsageData();
      setLoading(false);

      setUsedCredits(data.subscription.usedCredits);
      setSubscriptionCredits(data.subscription.credits);
      setPlan({
        name: data.plan.name,
        creditsPerMonth: data.plan.creditsPerMonth,
        domainsAllowed: data.plan.domainsAllowed
      })
      
    })()
  }, [])

  const handleClick = () => {
    console.log('Upgrade plan')
  }

  function getPercentage(nominator: number, denominator: number) {
    const result = ((nominator / denominator) * 100).toFixed(2);
    return +result;
  }

  function userHasActiveKey(keys: any[]) {
    if (keys.length === 0) return false;
    const hasActiveKey = keys.some(key => key.valid && key.enabled);
    return hasActiveKey;
  }

  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
      {/* <div className="bg-white shadow-md rounded-md p-6"> */}
      {keys && userHasActiveKey(keys)
        &&
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
          <p className="text-lg font-semibold">Using Own OpenAI API Key</p>
          <p>Your are using your own OpenAI API Key and your credits are not monitored.</p>
        </div>
      }
      <div className="flex gap-10 mt-4 items-center border-gray rounded-lg border-2 bg-white p-3 pr-1 shadow hover:shadow-md sm:p-4" role="listitem">
          <div className="flex flex-col items-center gap-2">
            <div style={{ width: 150, height: 150 }}>
              <CircularProgressbar
                value={getPercentage(usedCredits, subscriptionCredits)}
                text={`${getPercentage(usedCredits, subscriptionCredits)}%`} />
            </div>
            <p className="text-gray-400"><span className='font-bold'>{usedCredits}</span>  out of <span className='font-bold'>{subscriptionCredits}</span> used credits</p>
            <p className="text-gray-400">You have <span className='font-bold'>{subscriptionCredits - usedCredits}</span> credits left.</p>
          </div>
          <div className="grow flex gap-4 sm:items-center flex-col lg:items-start">
            <p className="text-gray-400">Your are on a <span className='font-bold'>{plan.name}</span> plan which includes:</p>
            <div className="flex flex-col gap-4 items-left">
              <p className="text-gray-400"><span className='font-bold'>{plan.creditsPerMonth}</span> credits {plan.name === 'Free'? "" : "per month" }</p>
              <p className="text-gray-400"><span className='font-bold'>{plan.domainsAllowed}</span> domains allowed</p>
            </div>
          </div>
        </div>
      <div className="flex gap-4 mt-4 items-center border-gray rounded-lg border-2 bg-white p-3 pr-1 shadow hover:shadow-md sm:p-4" role="listitem">
        <div className="grow flex gap-4 sm:items-center flex-col">
          <p className="text-gray-400">Upgrade plan to get more credits and domains.</p>
          <button onClick={handleClick} className={`group flex items-center space-x-3 rounded-md border border-black bg-black px-3 py-2 text-sm font-medium text-white transition-all duration-75 hover:bg-white hover:text-black active:scale-95 `}>Upgrade plan</button>
        </div>
      </div>
      <div className="flex gap-4 mt-4 items-center border-gray rounded-lg border-2 bg-white p-3 pr-1 shadow hover:shadow-md sm:p-4" role="listitem">
        <div className="grow flex gap-4 sm:items-center flex-col">
          <p className="text-gray-400">Use your own <span className='font-bold'>OpenAI Key</span> and benefit from reduced costs</p>
          <Link href='/dashboard/keys'
            className="font-medium text-indigo-600 hover:text-indigo-500" >Add key</Link>
        </div>
      </div>
    </div>

  );
}