import React from 'react';

const SuccessMessage = ({ name }) => {
  return (
    <div className="max-w-md w-full p-4 md:p-6 2xl:p-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Registration successful!</h2>
        <p className="text-base text-black dark:text-white mb-4">
          Thank you, {name}.
        </p>
        <p className="text-base text-black dark:text-white mb-2">
         Your registration request has been successfully received and is currently under review.
        </p>
        <p className="text-base text-black dark:text-white mb-3">
          We will notify you via email as soon as the review process is complete. We appreciate your patience.
        </p>
        <p className="text-base text-black dark:text-white">
        <strong>We appreciate your patience!!</strong>
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage;
