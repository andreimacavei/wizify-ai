'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation"
import { Google } from "@/app/ui/icons"
import { useState } from "react";
import Image from 'next/image'
import { z } from "zod";

export default function Page() {
  const { data: session } = useSession();
  if (session)
    redirect("/dashboard")

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const schema = z
    .object({
      email: z.coerce.string().email().min(3),
      password: z.string().min(3),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    try {
      const validation = schema.safeParse({
        email,
        password,
        confirmPassword,
      });
      // Check form validation
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
        // throw new Error("Validation failed");
        return;
      }
      setErrors([]);

      // Call sign up API
      let res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        //TODO send verification email
        redirect("/signin");
      } else {
        console.log("Error signing up");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  
  // In Vercel getProviders() didn't work on and had error, so after some research
  // I found that NEXTAUTH_URL env variable should be set in Vercel.
  // const providers = await getProviders()

  return (
    <div className="flex justify-center">
      <div className="mt-[calc(15vh)] h-fit w-full sm:max-w-md overflow-hidden border-y border-gray-200 sm:rounded-2xl sm:border sm:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <a href="https://aiwizzard.vercel.app">
            <Image src="/images/logo/mage_ai.png" width="80" height="80" className="w-16" alt="Mage AI Logo" />
          </a>
          <h3 className="text-xl font-semibold">Sign in to AI Wizzard</h3>
          <p className="text-sm text-gray-500">Start using ChatGPT on your website.</p>
        </div>
        <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-10 sm:px-16">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">Email</label>
              <input id="email" type="email" name="email" className="mb-4 border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="mt-1 text-xs text-red">
              {
                errors.find((error) => error.for === "email")?.message
              }
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="mt-4 text-sm font-semibold">Password</label>
              <input id="password" type="password" name="password" className="border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="mt-1 text-xs text-red">
              {
                errors.find((error) => error.for === "password")?.message
              }
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="confirmPassword" className="mt-4 text-sm font-semibold">Re-type Password</label>
              <input id="confirmPassword" type="password"  name="confirmPassword" className="border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="mt-1 text-xs text-red">
              {
                errors.find((error) => error.for === "confirmPassword")
                  ?.message
              }
              </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white rounded-md px-3 py-2">Sign up</button>
          </form>

          <div className="mb-4 mt-1 border-t border-gray-300" />
          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <Link href="/signin" className="text-primary">
                Sign in
              </Link>
            </p>
          </div>

          {/* <SignInButton providerId="github">
            <Github className="w-4 h-4" />
            <p>Sign in with Github</p>
          </SignInButton> */}
          

          
          {/* <EmailForm /> */}
        </div>
      </div>
    </div>
  )
}
