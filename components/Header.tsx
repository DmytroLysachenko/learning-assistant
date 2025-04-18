import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm px-16">
      <div className="flex h-16 justify-between py-4">
        <Link href={"/"}>
          <span className="text-gradient gradient-primary font-heading text-2xl font-bold">
            LangAssist
          </span>
        </Link>

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
        </div>
      </div>
    </header>
  );
};

export default Header;
