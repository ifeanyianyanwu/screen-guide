"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#120f10] text-[#f2f7fc] flex items-center justify-center min-h-svh">
        <div className="max-w-md w-full space-y-8 p-10 bg-[#1c1917] rounded-xl shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-[#fca5a5]" />
            <h1 className="text-3xl font-bold text-center">
              Oops! Something went wrong
            </h1>
            <p className="text-[#bcc0c7] text-center">
              We apologize for the inconvenience. An unexpected error has
              occurred.
            </p>
          </div>
          <div className="bg-[#450a0a] p-4 rounded-md">
            <p className="text-[#fca5a5] text-sm font-mono break-all">
              Error: {error.message}
            </p>
            {error.digest && (
              <p className="text-[#fca5a5] text-xs mt-2 font-mono">
                Digest: {error.digest}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => reset()}
              className="w-full bg-[#3b82f6] hover:bg-[#60a5fa] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-opacity-50"
            >
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="w-full border-[#2e3441] bg-transparent text-[#f2f7fc] hover:bg-[#2e3441] font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
