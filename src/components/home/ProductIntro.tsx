'use client'
import { Hero, UseCaseExample } from '@/components/home';
import Script from 'next/script'

declare global {
  let enhanceInputElement: () => void;
}

function ProductIntro({ user }: { user: any }) {
  
  return (
    <>
      <Script src="./widget.js"
        strategy='lazyOnload'
        onReady={() => {
          try {
            
            const inputElements = document.querySelectorAll(
              'input[type="text"], textarea',
            );
    
            inputElements.forEach(enhanceInputElement);
          } catch (error) {
            console.error("Error loading widget", error);
          }
          
        }
      }
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