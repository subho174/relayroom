import { redirect } from "next/navigation";
import { SignUpForm } from "../../components/signup-form.jsx";
import verifyUser from "../../components/verifyUser.js";

export default async function LoginPage() {
  const session = await verifyUser();
    if (session) redirect('/chat')

  return (
    <div className="bg-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  );
}
