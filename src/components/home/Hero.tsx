import Link from 'next/link'

export default function Hero({
  loggedIn = false }: { loggedIn?: boolean}
) {
  return (
    <div className="flex flex-col gap-5 py-12 px-2.5 sm:px-0">
      <h1 className="font-display text-3xl font-bold leading-[1.15] text-black sm:text-6xl sm:leading-[1.15]">
        Enhance Your WebApp with<br />
        <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Wizzard AI</span>
      </h1>
      <h2 className="text-gray-600 sm:text-xl">Wizzard AI adds AI-capabilities to your webapp without any coding!.</h2>
      
      <div className="mx-auto space-x-4">
        {loggedIn &&
          <Link href="/dashboard" className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black">Go to Dashboard</Link>
        }
        {!loggedIn &&
          <Link href="/signin" className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black">Try now</Link>
        }
        </div>
        <h2 className='mt-4 text-gray-600 sm:text-xl'>Just create an account and add the following JS code to your website!</h2>
        <p className="mt-1 rounded-md bg-white p-4 text-xs text-graydark text-wrap overflow-auto">
            {`<script src="https://aiwizzard.vercel.app/widget.js?client_id={YOUR_CLIENT_ID}"></script>`}
        </p>
    </div>
  )
}