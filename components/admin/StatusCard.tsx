"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Database,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

interface StatusCardProps {
  generating: boolean;
  isRemovingDuplicates: boolean;
  isRemovingUntranslated: boolean;
  isCleaningAll: boolean;
}

const StatusBadge = ({
  active,
  icon,
  activeIcon,
  label,
  destructive = false,
}: {
  active: boolean;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  destructive?: boolean;
}) => (
  <Badge
    variant={active ? (destructive ? "destructive" : "default") : "outline"}
    className="flex gap-1 items-center"
  >
    {active ? activeIcon || <Loader2 className="h-3 w-3 animate-spin" /> : icon}
    {label}
  </Badge>
);

const StatusCard = ({
  generating,
  isRemovingDuplicates,
  isRemovingUntranslated,
  isCleaningAll,
}: StatusCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          System Status
        </CardTitle>
        <CardDescription>Current system status and operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Operations</span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                active={generating}
                icon={<FileText className="h-3 w-3" />}
                label="Word Generation"
              />
              <StatusBadge
                active={isRemovingDuplicates}
                icon={<RefreshCw className="h-3 w-3" />}
                label="Duplicate Removal"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Maintenance</span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                active={isRemovingUntranslated}
                icon={<X className="h-3 w-3" />}
                label="Untranslated Removal"
                destructive
              />
              <StatusBadge
                active={isCleaningAll}
                icon={<Trash2 className="h-3 w-3" />}
                label="Data Cleaning"
                destructive
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
