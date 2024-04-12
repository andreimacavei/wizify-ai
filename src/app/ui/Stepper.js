import React from "react";
import Image from "next/image";

export default function Stepper() {
  return (
    <div className="">
      <div className="mx-auto mt-8 flex max-w-screen-md flex-col justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* <p className="text-gray-500 font-regular mt-4 text-sm leading-7">
            STEPS
          </p> */}
          <h3 className="text-gray-900 text-3xl font-bold leading-normal tracking-tight sm:text-5xl lg:mt-20">
            How it <span className="text-indigo-600">Works?</span>
          </h3>
        </div>

        <div className="mt-20">
          <ul className="">
            <li className="mb-15 bg-gray-3 p-5 pb-10 text-center">
              <div className="flex flex-col items-center">
                <div className="relative top-0 -mt-16 flex-shrink-0">
                  <div className="flex h-15 w-15 items-center justify-center rounded-full border-4 border-white bg-indigo-500 text-xl font-semibold text-white">
                    1
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-gray-900 text-lg font-semibold leading-6">
                    Add a domain
                  </h4>
                  <p className="text-gray-500 mt-2 text-base leading-6">
                    Add your website where you want to use Wizard AI.
                    <br />
                    Example: https://mywebsite.com
                  </p>
                </div>
              </div>
            </li>
            <li className="mb-15 bg-gray-3 p-5 pb-10 text-center">
              <div className="flex flex-col items-center">
                <div className="relative top-0 -mt-16 flex-shrink-0">
                  <div className="flex h-15 w-15 items-center justify-center rounded-full border-4 border-white bg-indigo-500 text-xl font-semibold text-white">
                    2
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-gray-900 text-lg font-semibold leading-6">
                    Add JS script
                  </h4>
                  <p className="text-gray-500 mb-4 mt-2 text-base leading-6">
                    Add the generated script tag to your website main html / app
                    layout.
                  </p>
                  <img src="/images/copy-script.png" alt="copy script" />
                </div>
              </div>
            </li>
            <li className="mb-15 bg-gray-3 p-5 pb-10 text-center">
              <div className="flex flex-col items-center">
                <div className="relative top-0 -mt-16 flex-shrink-0">
                  <div className="flex h-15 w-15 items-center justify-center rounded-full border-4 border-white bg-indigo-500 text-xl font-semibold text-white">
                    3
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-gray-900 text-lg font-semibold leading-6">
                    Validate domain
                  </h4>
                  <p className="text-gray-500 mb-4 mt-2 text-base leading-6">
                    Use a widget action to validate your domain
                  </p>
                  <img src="/images/menu-action.png" alt="menu action" />
                </div>
              </div>
            </li>
            <li className="mb-15 bg-gray-3 p-5 pb-10 text-center">
              <div className="flex flex-col items-center">
                <div className="relative top-0 -mt-16 flex-shrink-0">
                  <div className="flex h-15 w-15 items-center justify-center rounded-full border-4 border-white bg-indigo-500 text-xl font-semibold text-white">
                    4
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-gray-900 text-lg font-semibold leading-6">
                    Done
                  </h4>
                  <p className="text mt-2 leading-6 text-teal-500 ">
                    Congrats! Your domain is validated and your website's
                    visitors can use Widget AI to enhance their experience 🎉
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
