import { getServerSession } from "next-auth";
import SignUpForm from "./SignUpForm";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
  return <SignUpForm />;
}
