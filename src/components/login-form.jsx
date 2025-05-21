"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SignInButtons } from "./Button";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import HomeLink from "@/src/components/HomeLink.jsx";

export function LoginForm({ className, ...props }) {
  const [isPending, startTransition] = useTransition();

  const logIn = (e) => {
    e.preventDefault();
    toast("Logging in...", { position: "top-right" });
    const formData = new FormData(e.target);
    const password = formData.get("password");
    const email = formData.get("email");

    startTransition(async () => {
      await signIn("credentials", {
        callbackUrl: "/chat",
        email,
        password,
        isLoggingIn: true,
      });
      // toast.success("Logged In successfully", { position: "top-right" });
      // console.log(res);
      
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInButtons />
          <form onSubmit={logIn}>
            <div className="grid gap-6">
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-[#1f1f1f] px-2 text-white">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
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
                    className="inputStyle"
                    type="password"
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
                      Authenticating...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="text-center text-white text-sm">
                Don't have an account ?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium underline underline-offset-4 text-[#fbaf03]"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <HomeLink />
        </CardContent>
      </Card>
    </div>
  );
}
