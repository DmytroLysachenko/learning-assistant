"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Settings,
  User,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Words",
      href: "/words",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Practice",
      href: "/practice",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "Achievements",
      href: "/achievements",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Statistics",
      href: "/statistics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Community",
      href: "/community",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
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
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "justify-start gap-2",
                pathname === item.href && "bg-secondary"
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>

        <Separator className="my-4" />

        <div className="px-4 py-2">
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">
            Your Streak
          </h3>
          <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">7 Day Streak</span>
                <span className="text-xs text-muted-foreground">+2</span>
              </div>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link href="/profile">
            <User className="h-5 w-5" />
            Profile
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="mt-1 w-full justify-start gap-2"
          asChild
        >
          <Link href="/settings">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  );
}
