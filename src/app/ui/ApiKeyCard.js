"use client";
import { useContext, useState, useEffect } from "react";
import { getUserApiKeys } from "@/app/lib/actions";
import { KeyContext } from "@/app/context";

export default function ApiKeyCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { keys, setKeys } = useContext(KeyContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let data = await getUserApiKeys();
      setLoading(false);

      if (data === null) {
        setError(true);
        return;
      }
      setKeys(data);
    })();
  }, []);
  return (
    <>
      <ul className="max-w-xxl mx-auto mt-16 overflow-hidden bg-white shadow sm:rounded-md">
        {keys &&
          keys.length > 0 &&
          keys.map((apiKey) => (
            <li key={apiKey.key} className="border-t border-gray">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 text-lg font-medium leading-6">
                    {apiKey.key}
                  </h3>
                  <p className="text-gray-500 mt-1 max-w-2xl text-sm">
                    Description for Item 1
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-gray-500 text-sm font-medium">
                    Status: <span className="text-green-600">Active</span>
                  </p>
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </a>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
