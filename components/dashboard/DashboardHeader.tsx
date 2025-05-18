"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Settings, Trophy, Zap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

const DashboardHeader = ({
  user,
}: {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    experience: number | null;
    rank: number | null;
  };
}) => {
  return (
    <header className="flex px-6 mt-4 md:px-8 md:mt-6 overflow-y-auto items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 md:size-20">
          <AvatarImage
            src={user.image ?? ""}
            alt="User profile picture"
          />
          <AvatarFallback className="text-lg md:text-2xl bg-fluent/30">
            {user.name?.split(" ")[0][0]}
            {user.name?.split(" ")[1][0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground text-sm">
            Joined {user.createdAt?.toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary"
            >
              <Zap className="h-3 w-3 mr-1" />
              {user.experience} XP
            </Badge>

            <Badge
              variant="outline"
              className="bg-secondary/10"
            >
              <Trophy className="h-3 w-3 mr-1" />
              Rank #{user.rank}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-col md:flex-row md:items-center">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full md:rounded-lg flex justify-center items-center"
          asChild
        >
          <Link href="/settings">
            <Settings className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Settings</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full md:rounded-lg flex justify-center items-center"
          onClick={async () =>
            await signOut({ redirect: true, redirectTo: "/login" })
          }
        >
          <LogOut className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
