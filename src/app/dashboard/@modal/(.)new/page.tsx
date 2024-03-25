'use client'

import Link from 'next/link'

import { registerNewDomain } from '@/app/lib/actions'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import ModalRadix from "@/components/ModalRadix";

const urlRegex = /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;

export default function NewDomainModal() {

	const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errors, setErrors] = useState([]); 
	const [success, setSuccess] = useState(false)
	const router = useRouter();

  // Get user session token
  // const {data: session, status} = useSession();
  // if (!session || !session.user)
  //   redirect('/signin')

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault()
		let formData = new FormData(e.target as HTMLFormElement);

		setError(false)
		setLoading(true)
		let result = await registerNewDomain(formData)
    setLoading(false)

		if (result.status === 'success'){
			setSuccess(true)
			router.back()
			// router.push('/dashboard/newdomain')
    } else {
      setError(true) 
      setErrors(result.errors);
    }
			
	}

	return (
		<ModalRadix>
		<div className='col-span-1 auto-rows-min grid-cols-1 lg:col-span-5 border-gray-50 rounded-lg border-2 bg-white mt-4 p-3 shadow sm:p-4'>
			<h2 className="text-xl text-blue-500 border-b border-blue-500 pb-2 my-4">Add Wizzard AI to your website:</h2>
			<form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col gap-4">
				<label htmlFor="domain" className="text-slate-600 text-xm">
					Which site/domain you want to add to? ([http/https]://example.com)
				</label>
				<div className='flex gap-4 items-center'>
					<input id="domain" name="domain" type="text" minLength={5} maxLength={50} required
						placeholder='Example: mywebsite.com'
						className="grow border border-slate-300 rounded px-2 py-1 outline-none text-slate-800" />
				</div>
        <label className="text-slate-600 text-xm">
          After you add your domain you can use Wizzard AI on your website.
        </label>

				{/* <label htmlFor="maxCredits" className="text-slate-400 text-xs">
					Set a limit of credits to use!
				</label> */}
				{/* <div className='flex gap-4 items-center'>
					<input id="maxCredits" name="maxCredits" type="number" min={1000} max={user.credits} defaultValue={5000} required
						className="border border-slate-300 rounded px-2 py-1 outline-none text-slate-800" />
					days
				</div> */}
				<div className='flex justify-end gap-2'>
					<button type="submit" disabled={loading} className="border text-blue-500 border-blue-500 rounded px-2 py-1 hover:bg-blue-500 hover:bg-opacity-20 focus-within:bg-orange-500 focus-within:bg-opacity-20 enabled:active:scale-95 transition-all duration-75 disabled:cursor-default">Create</button>
					<button onClick={router.back} className='border border-gray-300 rounded px-2 py-1 hover:bg-gray focus-within:bg-gray-200 active:scale-95 transition-all duration-75'>Cancel</button>
				</div>
				{loading && <p className='mt-4 text-green-500 text-center'>Loading...</p>}
          {/* {error && <p className='mt-4 text-red text-center'>Something went wrong. Please try again.</p>} */}
          <div className="mt-4 text-red text-center">
            {errors.find((error) => error.for === "domainURL")?.message}
          </div>
					{success && <p className='mt-4 text-green-500 text-center'>Website registered!</p>}
					{error && <p className='mt-4 text-red-500 text-center'>Something went wrong. Please try again.</p>}
			</form>
			</div>
			</ModalRadix>
	)
}