import { Flame } from "lucide-react";
import Link from "next/link";
import React from "react";

import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/actions/user";

const Header = async () => {
  const session = await auth();
  let isAuthenticated;

  if (session && session.user && session.user.email) {
    const user = await getUserByEmail(session.user.email);
    isAuthenticated = !!user;
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm px-16">
      <div className="flex h-16 justify-between py-4">
        <div className="flex h-10 items-center px-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
          >
            <Flame className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              LinguaLearn
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            How It Works
          </Link>
          <Link
            href="#roadmap"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Roadmap
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/user/dashboard"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
