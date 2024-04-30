"use client";
import { useContext, useState, useEffect } from "react";
import { Suspense } from "react";
import { getUserApiKeys, deleteApiKey, updateKey } from "@/app/lib/actions";
import { KeyContext } from "@/app/context";
import { ContextMenuButton } from "@/app/ui";
import { VerticalEllipsis } from "@/app/ui/icons";

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

  const removeKey = async (key) => {
    try {
      let res = await deleteApiKey(key);
      if (res) {
        let newKeys = keys.filter((k) => k.key !== key);
        setKeys(newKeys);

        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  };

  const keyStatusToggle = async (key, status) => {
    try {
      const params = { enabled: status === "disabled" ? true : false };
      let res = await updateKey(key, params);
      if (res) {
        setKeys((prevKeys) => {
          return prevKeys.map((k) => {
            if (k.key === key) {
              return { ...k, enabled: !k.enabled };
            }
            return k;
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ul className="max-w-xxl mx-auto mt-8 overflow-hidden shadow sm:rounded-md">
        {keys &&
          keys.length > 0 &&
          keys.map((apiKey) => (
            <li
              key={apiKey.key}
              className="rounded-lg border-2 border-gray bg-white"
            >
              <div className="flex flex-col px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 text-lg font-medium leading-6">
                    {apiKey.key}
                  </h3>
                  <p className="text-gray-500 mt-1 max-w-2xl text-sm">
                    {apiKey.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-gray-500 text-sm font-medium">
                    Status:{" "}
                    <span
                      className={`${apiKey.enabled ? "text-green-500" : "text-red"}`}
                    >
                      {apiKey.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex self-end text-sm italic">
                    <span
                      className={`${apiKey.valid ? "text-green-500" : "text-red"}`}
                    >
                      {apiKey.valid ? "Valid" : "Not Validated"}
                    </span>
                  </div>
                  <Suspense
                    fallback={
                      <VerticalEllipsis className="fill-gray-500 p-1" />
                    }
                  >
                    <ContextMenuButton
                      id={apiKey.key}
                      deleteDialogTitle="Delete API Key"
                      deleteDialogDescription="Are you sure you want to delete this API key?"
                      remove={removeKey}
                      keyEnabled={apiKey.enabled}
                      keyStatusToggle={keyStatusToggle}
                    />
                  </Suspense>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
