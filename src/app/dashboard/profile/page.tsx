import { updateProfile } from "@/app/lib/actions";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/lib/authOptions';
import { redirect } from 'next/navigation';


export default async function page() {
  // Get user session token
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    redirect('/')
  const { user } = session

  // TODO: Loading, error, and success states
  // TODO: Update user profile - global state
  // TODO: Handle timezone change

  return (
		<div className='col-span-1 auto-rows-min grid-cols-1 lg:col-span-5 rounded-lg border-1 bg-white mt-4 p-3 shadow sm:p-4'>
			<h2 className="text-xl text-orange border-b border-orange pb-2 my-4">Profile:</h2>
      <form action={updateProfile} className="flex flex-col gap-4">
        {/* <ProfileImageUpdater id={user.id} img={user.image!} /> */}
        <label htmlFor="name" className="text-slate-400 text-xs">
          Name:
        </label>
        <input id="name" name="name" defaultValue={user.name!} type="text" minLength={3} maxLength={20} required
          placeholder='John Doe or Jane'
          className="grow border border-slate-300 rounded px-2 py-1 outline-none text-slate-800" >
          </input>
        
        <div className='flex justify-end gap-2'>
          <button type="submit" className="border text-orange border-orange rounded px-2 py-1 hover:bg-orange hover:bg-opacity-20 focus-within:bg-orange focus-within:bg-opacity-20 active:scale-95 transition-all duration-75">Save Changes</button>
          <Link href="/dashboard" className='border border-gray rounded px-2 py-1 hover:bg-gray-200 focus-within:bg-gray-200 active:scale-95 transition-all duration-75'>Cancel</Link>
        </div>
      </form>
    </div>
  )
}
