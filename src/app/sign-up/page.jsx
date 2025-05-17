import {authOptions} from "../api/auth/[...nextauth]/options.js";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignUpForm } from "../../components/signup-form.jsx";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  );
}
