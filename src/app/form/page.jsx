"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    domains: [""],
  });
  const router = useRouter();

  const addDomain = () => {
    setUserInfo({ ...userInfo, domains: [...userInfo.domains, ""] });
  };

  const updateDomain = (index, value) => {
    const updatedDomains = [...userInfo.domains];
    updatedDomains[index] = value;
    setUserInfo({ ...userInfo, domains: updatedDomains });
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would send a request to your backend to save to Redis
    const response = await fetch("YOUR_BACKEND_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (response.ok) {
      // Handle successful save
      console.log("Data saved");
    } else {
      // Handle error
      console.error("Failed to save data");
    }
  };

  const handleLogout = () => {
    // Here you would handle the logout logic
    router.push("/login");
  };

  return (
    <div className="bg-gray-100 flex h-screen">
      <div className="hidden w-64 bg-white shadow-md sm:block"></div>
      <div className="flex-1 p-10">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div>
            <span className="mr-4">Logged in as User</span>
            <button
              className="bg-red-500 rounded px-4 py-2 text-white shadow"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="Name"
            className="block w-full rounded border p-2"
          />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="Email"
            className="block w-full rounded border p-2"
          />
          {userInfo.domains.map((domain, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                name={`domain-${index}`}
                value={domain}
                onChange={(e) => updateDomain(index, e.target.value)}
                placeholder="Web domain"
                className="block w-full rounded border p-2"
              />
              {index === userInfo.domains.length - 1 && (
                <button
                  type="button"
                  onClick={addDomain}
                  className="rounded bg-blue-500 p-2 text-white"
                >
                  +
                </button>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 rounded bg-green-500 px-4 py-2 text-white shadow"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
