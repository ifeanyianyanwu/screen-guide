import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Inter } from "next/font/google";
import { UserIcon } from "@/components/header/user-icon";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Watch Wander",
  description:
    "Explore trending movies, TV shows, new releases, and so much more. Dive into categories, uncover hidden gems, track what's hot, and find where to watch—all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header>
          <UserIcon />
        </Header>
        {children}
      </body>
    </html>
  );
}
