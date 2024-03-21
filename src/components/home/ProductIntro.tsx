'use client'
import { Hero, UseCaseExample } from '@/components/home';
import Script from 'next/script'

function ProductIntro({ user }: { user: any }) {
  
  return (
    <>
      <Script src="http://localhost:3000/widget.js"
        strategy='lazyOnload'
        onReady={() => {
          console.log("Widget Loaded from Script onLoad")
          const inputElements = document.querySelectorAll(
            'input[type="text"], textarea',
          );
          inputElements.forEach(enhanceInputElement);
        }}
      />
      <div className="mx-auto max-w-md sm:max-w-lg text-center">
        {user && <Hero loggedIn />}
        {!user && <Hero />}
        <ul className="my-5 grid gap-2">
          <UseCaseExample useCase={{
            name: 'Example simple input',
            content: 'Test this wicked widget',
            inputType: 'input',
            style: { width: '100%', height: '20px' }
          }} />
          <UseCaseExample useCase={{
            name: 'Example simple input',
            content: 'Test this wicked widget',
            inputType: 'textarea',
            style: { width: '100%', height: '100px' }
          }} />
        </ul>
        <div className="mt-14">
          <h2 className="text-gray-600 sm:text-xl">MageAI is available on Edge Environments. This makes it incredible fast for your calls!</h2>
        </div>
      </div>
      {/* <Script src="widget.js"
        strategy='lazyOnload'
        /> */}
    </>
  )
}

export default ProductIntro;