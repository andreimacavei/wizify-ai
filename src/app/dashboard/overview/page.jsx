"use client";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

/*
TODO: Modify this component to fit your needs.
The ProfilePage component was completely generated with Github Copilot.
*/

export default function OverviewPage() {
  const { data: session } = useSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const [userDetails, setUserDetails] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    domains: ["example.com"],
    editables: {
      firstName: false,
      lastName: false,
      email: false,
      domains: [false],
    },
  });

  const handleEditToggle = (field, index = null) => {
    if (index !== null) {
      const newEditables = userDetails.editables.domains.map((editable, idx) =>
        index === idx ? !editable : editable,
      );
      setUserDetails({
        ...userDetails,
        editables: { ...userDetails.editables, domains: newEditables },
      });
    } else {
      setUserDetails({
        ...userDetails,
        editables: {
          ...userDetails.editables,
          [field]: !userDetails.editables[field],
        },
      });
    }
  };

  const handleChange = (e, field, index = null) => {
    if (index !== null) {
      const newDomains = userDetails.domains.map((domain, idx) =>
        index === idx ? e.target.value : domain,
      );
      setUserDetails({ ...userDetails, domains: newDomains });
    } else {
      setUserDetails({ ...userDetails, [field]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating user details:", userDetails);
    // Here, you would handle submitting the updated user details to your backend
  };

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {Object.keys(userDetails).map((field, index) => {
          if (field === "editables") return null;
          return Array.isArray(userDetails[field]) ? (
            userDetails[field].map((value, idx) => (
              <div
                key={`${field}-${idx}`}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(e, field, idx)}
                  className="flex-1 rounded border p-2"
                  readOnly={!userDetails.editables.domains[idx]}
                />
                <button
                  type="button"
                  onClick={() => handleEditToggle(field, idx)}
                  className="p-2"
                >
                  <PencilIcon className="text-gray-500 h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <div key={field} className="flex items-center space-x-2">
              <input
                type="text"
                value={userDetails[field]}
                onChange={(e) => handleChange(e, field)}
                className="flex-1 rounded border p-2"
                readOnly={!userDetails.editables[field]}
              />
              <button
                type="button"
                onClick={() => handleEditToggle(field)}
                className="p-2"
              >
                <PencilIcon className="text-gray-500 h-5 w-5" />
              </button>
            </div>
          );
        })}
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
        >
          Update
        </button>
      </form>
    </DefaultLayout>
  );
}
