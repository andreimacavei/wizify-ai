'use client'
import { Hero, UseCaseExample } from '@/components/home';
import Script from 'next/script'

declare global {
  let enhanceInputElement: () => void;
}

function ProductIntro({ user, clientKey }: { user: any, clientKey: string}) {

  /*
  Because of a hydration error when inserting the script tag in the head of the document,
  we have to use NextJs's Script component to load the widget.js script. This problem is because
  the server side rendered page differs from the client rendered page (modified by our widget.js)
  
  */

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
      <div className="mx-auto max-w-xl sm:max-w-lg text-center">
        {user && <Hero loggedIn />}
        {!user && <Hero />}
        <h2 className="text-gray-600 sm:text-xl">Here are some usecase example for text inputs</h2>
        <div className="my-4 grid gap-2">
          <UseCaseExample useCase={{
            name: 'Example simple input',
            content: 'Hi, I am a widget and I want to help you!',
            inputType: 'input',
            style: { width: '100%', height: '25px' }
          }} >
            </UseCaseExample>
          <UseCaseExample useCase={{
            name: 'Example text area',
            content: 'Hi, I am a wizzard widget and I want show you how I can help! Just click the bottom right corner!',
            inputType: 'textarea',
            style: { width: '100%', height: '100px' }
          }} >
            </UseCaseExample>
        </div>
        <div className="mt-14">
          <h2 className="text-gray-600 sm:text-xl">Wizard AI is running on Edge Environments making it really fast!</h2>
        </div>
      </div>
    </>
  )
}

export default ProductIntro;