import { getServerSession } from "next-auth";
import SignInForm from "./form";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return <SignInForm />;
}
