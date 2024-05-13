import Link from 'next/link'
import Image from 'next/image'
import { Profile, ProfileServer } from '@/components/templates'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";


export default async function Header() {
	const session = await getServerSession(authOptions);
	
	const landingPageUrl = process.env.WIZZARD_AI_PUBLIC_URL;
	
	return (
		<header className="sticky left-0 right-0 top-0 z-20 border-b border-gray-200 bg-white">
			<div className='flex justify-between items-center mx-auto w-full max-w-screen-xl py-2 px-2.5'>
				<h1 className="text-3xl">
					<Link href={`${landingPageUrl}/`} className='flex flex-row gap-1 items-center'>
					<Image src="/images/logo/logo-1.png" alt='Logo' width={50} height={50} />
					<span className="font-bold bg-gradient-to-r from-cyan-500 via-orangeLight  to-orange bg-clip-text text-transparent">Wizify</span>
					</Link>
				</h1>

				<div className="flex items-center gap-3 2xsm:gap-7">
				<ul className="flex items-center gap-2 2xsm:gap-4">
						{!session || !session.user ? <ProfileServer /> : <Profile key='x' />}
						{/* <DarkModeSwitcher /> */}
				</ul>
					
				</div>
			</div>
		</header>
	)
}
