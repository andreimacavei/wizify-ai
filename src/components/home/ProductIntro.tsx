'use client'
import { Hero, UseCaseExample } from '@/components/home';
import Script from 'next/script'

declare global {
  let enhanceInputElement: () => void;
}

function ProductIntro({ user }: { user: any }) {
  //TODO hardcoded client key for now to make development easy
  let clientKey = "Saj9efJD0rdChcPuZCCISTwzeR2ZRKnrjsOyYOh5uBQ";

  return (
    <>
      <Script src={`./widget.js?client_key=${clientKey}`}
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
      <div className="mx-auto max-w-xl sm:max-w-lg text-left">
        {user && <Hero loggedIn />}
        {!user && <Hero />}
        <h2 className="text-gray-600 sm:text-xl">Here are some usecase example for text inputs</h2>
        <ul className="my-4 grid gap-2">
          <UseCaseExample useCase={{
            name: 'Example simple input',
            content: 'Hi, I am a widget and I want to help you!',
            inputType: 'input',
            style: { width: '100%', height: '25px' }
          }} />
          <UseCaseExample useCase={{
            name: 'Example simple input',
            content: 'Hi, I am a wizzard widget and I want show you how I can help! Just click the bottom right corner!',
            inputType: 'textarea',
            style: { width: '100%', height: '100px' }
          }} />
        </ul>
        <div className="mt-14">
          <h2 className="text-gray-600 sm:text-xl">Wizzard AI is running on Edge Environments making it really fast!</h2>
        </div>
      </div>
    </>
  )
}

export default ProductIntro;