// ErrorMessage.tsx
import React from 'react';

const ErrorMessage = () => {
  return (
    <div className="max-w-md w-full p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Registration failed!</h2>
        <p className="text-base text-black dark:text-white mb-3">
        Unfortunately, there was an error processing your registration request. 
        </p>
        <p className="text-base text-black dark:text-white mb-3">
          Please try again later or contact our support team for assistance. 
        </p>
        <p className="text-base text-black dark:text-white">
        <strong>We apologize for any inconvenience caused!!</strong>
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
