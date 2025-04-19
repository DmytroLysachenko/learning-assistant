import type React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: number;
}

export default function StatisticsCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatisticsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              {trend !== undefined && (
                <div
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend > 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="rounded-full p-2 bg-primary/10">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
