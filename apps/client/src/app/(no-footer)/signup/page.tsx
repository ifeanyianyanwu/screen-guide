"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/lib/actions";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [state, dispatch] = useFormState(signUpAction, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success("Signed up successfully");
      router.push("/");
    }
  }, [state, router]);

  return (
    <div className="flex min-h-svh pt-20">
      <div className="m-auto w-full max-w-md space-y-8 rounded-xl px-4">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Create an account</h2>
          <p className="mt-2 text-sm text-[#bcc0c7]">Sign up to get started</p>
        </div>
        <form className="mt-8 space-y-6" action={dispatch}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-md border border-[#2e3441] bg-[#120f10] px-3 py-2 text-[#f2f7fc] placeholder-[#bcc0c7] focus:z-10 focus:border-[#3b82f6] focus:outline-none focus:ring-[#3b82f6] sm:text-sm"
                  placeholder="Email address"
                />
                <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#bcc0c7]" />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="relative block w-full appearance-none rounded-md border border-[#2e3441] bg-[#120f10] px-3 py-2 text-[#f2f7fc] placeholder-[#bcc0c7] focus:z-10 focus:border-[#3b82f6] focus:outline-none focus:ring-[#3b82f6] sm:text-sm"
                  placeholder="Password"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#bcc0c7]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#bcc0c7]" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="relative block w-full appearance-none rounded-md border border-[#2e3441] bg-[#120f10] px-3 py-2 text-[#f2f7fc] placeholder-[#bcc0c7] focus:z-10 focus:border-[#3b82f6] focus:outline-none focus:ring-[#3b82f6] sm:text-sm"
                  placeholder="Confirm Password"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-[#bcc0c7]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#bcc0c7]" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {state?.error && (
            <div className="rounded-md bg-[#450a0a] p-4">
              <p className="text-sm text-[#fca5a5]">{state.error}</p>
            </div>
          )}

          <div>
            <SignUpButton />
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2e3441]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#120f10] px-2 text-[#bcc0c7]">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full border-[#2e3441] bg-[#120f10] text-[#f2f7fc] hover:bg-[#2e3441]"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#bcc0c7]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-[#3b82f6] hover:text-[#60a5fa]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#120f10]"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? "Signing up..." : "Sign up"}
    </Button>
  );
}
