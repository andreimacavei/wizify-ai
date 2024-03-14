'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const urlRegex = /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;

const RegisterDomains = () => {
  const [errors, setErrors] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    domains: [""],
  });
  const [success, setSuccess] = useState(false);

  const schema = z.object({
    name: z.string().min(3),
    email: z.coerce.string().email().min(5),
    domains: z.array(z.string().regex(urlRegex))
      .min(1),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validation = schema.safeParse(userInfo);
      
      if (validation.success === false) {
        let errorArr = [];
        const err = validation.error;
        err.errors.forEach((error) => {
          errorArr.push({
            for: error.path[0],
            message: error.message,
          });
        });
        setErrors(errorArr);
        throw new Error("Invalid domain");
      }
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to save data");
      } 

      setErrors([]);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    
  }

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const updateDomain = (index, value) => {
    const updatedDomains = [...userInfo.domains];
    updatedDomains[index] = value;
    setUserInfo({ ...userInfo, domains: updatedDomains });
  };

  const handleDeleteDomain = (index) => {
    const domains = [...userInfo.domains];
    domains.splice(index, 1);
    setUserInfo({ ...userInfo, domains: domains });
    console.log(userInfo.domains);
  }

  const handleAddDomain = () => {
    setUserInfo({ ...userInfo, domains: [...userInfo.domains, ""] });
    console.log(userInfo.domains);
  }

  const closeSuccessPopup = () => {
    // set success `false` to hide popup
    setSuccess(false);
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Input Fields --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:w-1/2">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Complete registration of your domain(s)
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Domain Holder Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={userInfo.name}
                      onChange={(e) => handleChange(e)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                    <div className="mt-1 text-xs text-red">
                      {errors.find((error) => error.for === "name")?.message}
                    </div>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <div className="mt-1 text-xs text-red">
                    {errors.find((error) => error.for === "email")?.message}
                  </div>
                  </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Domain(s) from where you want to use Mage AI widget <span className="text-meta-1">*</span>
                </label>
                
                {userInfo.domains.map((domain, index) => (
                  <div className="flex items-center mb-4.5 space-x-2" key={index}>
                    <input
                      type="text"
                      placeholder="Domain URL"
                      value={domain}
                      onChange={(e) => updateDomain(index, e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {userInfo.domains.length > 1 && index < userInfo.domains.length - 1 && (
                      <button className="rounded bg-red p-2 text-white"
                        type="button"
                        onClick={() => handleDeleteDomain(index)}
                      >-
                      </button>
                    )}
                    {index === userInfo.domains.length - 1 && (
                      <button className="rounded bg-blue-500 p-2 text-white"
                        type="button"
                        onClick={() => handleAddDomain()}
                      >+
                      </button>
                    )}
                  </div>
                ))}      
                <div className="mt-1 text-xs text-red">
                  {errors.find((error) => error.for === "domains")?"Invalid domain":null}
                </div>
                </div>
                  <button type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  disabled={isLoading} 
                >
                  {isLoading ? "Submiting..." : "Submit"}
                </button>
              </div>
            </form>
        </div>
        {success && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md text-center">
              <p className="text-green-500 text-lg font-semibold mb-4">
                Data Successfully Saved!
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={closeSuccessPopup}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default RegisterDomains;