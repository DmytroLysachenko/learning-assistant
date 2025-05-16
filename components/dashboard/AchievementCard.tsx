import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    progress: number;
    target: number;
    level: number;
  };
  detailed?: boolean;
}

const AchievementCard = ({
  achievement,
  detailed = false,
}: AchievementCardProps) => {
  const progressPercentage = Math.min(
    100,
    (achievement.progress / achievement.target) * 100
  );

  return (
    <Card className={detailed ? "" : "overflow-hidden"}>
      <div className="flex">
        <div
          className={`${
            detailed ? "p-6" : "p-4"
          } flex items-center justify-center ${
            detailed ? "w-24" : "w-16"
          } bg-gradient-to-br from-primary/20 to-primary/5`}
        >
          <div className={`text-${detailed ? "4xl" : "3xl"}`}>
            {achievement.icon}
          </div>
        </div>
        <div className="flex-1">
          <CardHeader className={detailed ? "pb-2" : "p-4 pb-2"}>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                {achievement.name}
                <Badge
                  variant="outline"
                  className="ml-2 bg-primary/10 text-xs"
                >
                  Level {achievement.level}
                </Badge>
              </CardTitle>
              <span className="text-sm font-medium">
                {achievement.progress}/{achievement.target}
              </span>
            </div>
            <CardDescription>{achievement.description}</CardDescription>
          </CardHeader>
          <CardContent className={detailed ? "pt-0" : "p-4 pt-0"}>
            <div className="space-y-2">
              <Progress
                value={progressPercentage}
                className="h-2"
              />
              {detailed && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progressPercentage.toFixed(0)}% complete</span>
                  <span>
                    {achievement.target - achievement.progress} more to go
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default AchievementCard;
