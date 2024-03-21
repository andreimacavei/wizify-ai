import Link from 'next/link'

export default function Hero({
  loggedIn = false }: { loggedIn?: boolean}
) {
  return (
    <div className="flex flex-col gap-5 py-12 px-2.5 sm:px-0">
      <h1 className="font-display text-3xl font-bold leading-[1.15] text-black sm:text-6xl sm:leading-[1.15]">
        Enhance WebApps with<br />
        <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">MageAI</span>
      </h1>
      <h2 className="text-gray-600 sm:text-xl">MageAI is a micro SaaS product that adds AI-capabilities to your app without any coding! In less than 5 minutes!.</h2>
      <div className="mx-auto space-x-4">
        {loggedIn &&
          <Link href="/dashboard/overview" className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black">Go to Dashboard</Link>
        }
        {!loggedIn &&
          <Link href="/signin" className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black">Try now</Link>
        }
      </div>
    </div>
  )
}