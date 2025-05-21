"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SignUpButtons } from "./Button";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function SignUpForm({ className, ...props }) {
  const [isPending, startTransition] = useTransition();

  const SignUp = (e) => {
    e.preventDefault();
    toast.info("Creating account...", { position: "top-right" });
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    startTransition(async () => {
      await signIn("credentials", {
        callbackUrl: "/chat",
        username,
        email,
        password,
        isLoggingIn: false,
      });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpButtons />
          <form onSubmit={SignUp}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-[#1f1f1f] px-2 text-white">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <input
                    name="username"
                    type="text"
                    className="inputStyle"
                    placeholder="user"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <input
                    name="email"
                    type="email"
                    className="inputStyle"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    {/* <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <input
                    name="password"
                    type="password"
                    className="inputStyle"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  variant="custom"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Just a moment...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm text-white">
                Already have an account ?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium underline underline-offset-4 text-[#fbaf03]"
                >
                  LogIn
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
