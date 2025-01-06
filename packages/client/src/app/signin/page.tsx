"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/lib/actions";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginPage() {
  const router = useRouter();
  const [state, dispatch] = useFormState(signInAction, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/"); // Redirect to home page on successful login
    }
  }, [state, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form action={dispatch}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary">
                    <GalleryVerticalEnd className="size-10 text-primary-foreground" />
                  </div>
                  <span className="sr-only">Acme Inc.</span>
                </a>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    name="password"
                  />
                </div>
                {state?.error ? (
                  <div>
                    <p>{state.error}</p>
                  </div>
                ) : null}
                <LoginButton />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      Login
    </Button>
  );
}
