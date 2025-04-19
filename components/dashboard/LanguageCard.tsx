import Link from "next/link";
import { BookOpen, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface LanguageCardProps {
  language: {
    code: string;
    name: string;
    flag: string;
    progress: number;
    level: string;
    wordsLearned: number;
    lastPracticed: string;
  };
}

export default function LanguageCard({ language }: LanguageCardProps) {
  // Function to determine level color
  const getLevelColor = (level: string) => {
    switch (level[0]) {
      case "A":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "B":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "C":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{language.flag}</div>
          <div>
            <h3 className="font-bold">{language.name}</h3>
            <Badge className={`mt-1 ${getLevelColor(language.level)}`}>
              Level {language.level}
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{language.progress}%</span>
            </div>
            <Progress
              value={language.progress}
              className="h-2"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {language.wordsLearned} words learned
            </span>
            <span className="text-muted-foreground">
              Last: {language.lastPracticed}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          asChild
        >
          <Link href={`/vocabulary/${language.code}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            Vocabulary
          </Link>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          asChild
        >
          <Link href={`/practice/${language.code}`}>
            <Zap className="h-4 w-4 mr-2" />
            Practice
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
