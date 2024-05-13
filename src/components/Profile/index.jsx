"use client";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
/*
TODO: Modify this component to fit your needs.
The ProfilePage component was generated with Github Copilot.
*/

export default function ProfilePage() {
  const { data: session } = useSession();
  if (!session || !session.user) {
    redirect("/signin");
  }

  const [userDetails, setUserDetails] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@test.com",
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
    <form onSubmit={handleSubmit} className="space-y-4 p-5">
      {Object.keys(userDetails).map((field, index) => {
        if (field === "editables") return null;
        return Array.isArray(userDetails[field]) ? (
          userDetails[field].map((value, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(e, field, idx)}
                disabled={!userDetails.editables[field][idx]}
                className="border-gray-300 border-b-2"
              ></input>
              <button
                type="button"
                onClick={() => handleEditToggle(field, idx)}
                className="text-orange"
              >
                {userDetails.editables[field][idx] ? "Save" : "Edit"}
              </button>
            </div>
          ))
        ) : (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={userDetails[field]}
              onChange={(e) => handleChange(e, field)}
              disabled={!userDetails.editables[field]}
              className="border-gray-300 border-b-2"
            ></input>
            <button
              type="button"
              onClick={() => handleEditToggle(field)}
              className="text-orange"
            >
              {userDetails.editables[field] ? "Save" : "Edit"}
            </button>
          </div>
        );
      })}
      <button type="submit" className="bg-orange rounded px-4 py-2 text-white">
        Save Changes
      </button>
    </form>
  );
}
