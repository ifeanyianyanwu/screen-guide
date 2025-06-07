import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="container mx-auto px-4">
      <div className="flex py-8 justify-between border-t border-accent text-center text-sm text-paragraph">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/movie"
              className="hover:text-primary transition-colors"
            >
              Movies
            </Link>
          </li>
          <li>
            <Link href="/tv" className="hover:text-primary transition-colors">
              TV Shows
            </Link>
          </li>
        </ul>
        <div className="flex space-x-4">
          <Link
            href="https://www.linkedin.com/in/ifeanyianyanwu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#bcc0c7] hover:text-[#3b82f6] transition-colors"
          >
            <Linkedin size={20} />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="https://x.com/ifeanyianyanwu_?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#bcc0c7] hover:text-[#3b82f6] transition-colors"
          >
            <Twitter size={20} />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="https://github.com/ifeanyianyanwu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#bcc0c7] hover:text-[#3b82f6] transition-colors"
          >
            <Github size={20} />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
        {/* © {new Date().getFullYear()} Screen Guide. All rights reserved. */}
      </div>
    </footer>
  );
}
