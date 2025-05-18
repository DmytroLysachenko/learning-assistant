import Link from "next/link";
import { BookOpen, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LanguageCardProps {
  language: {
    code: string;
    name: string;
    flag: string;
    progress: number;
    wordsLearned: number;
    lastPracticed: string;
  };
}

const LanguageCard = ({ language }: LanguageCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{language.flag}</div>
          <div>
            <h3 className="font-bold">{language.name}</h3>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">
                {language.progress.toFixed(1)}%
              </span>
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
              Last Practiced: {language.lastPracticed}
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
};

export default LanguageCard;
