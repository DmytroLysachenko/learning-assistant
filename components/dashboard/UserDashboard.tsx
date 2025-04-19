"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DashboardSidebar from "./DashboardSidebar";
import StatisticsCard from "./StatisticsCard";
import LanguageCard from "./LanguageCard";
import AchievementCard from "./AchievementCard";

interface UserDashboardProps {
  user: {
    name: string;
    email: string;
    image: string;
    joinDate: string;
    streak: number;
    totalXP: number;
    level: string;
    rank: number;
  };
  languages: Array<{
    code: string;
    name: string;
    flag: string;
    progress: number;
    level: string;
    wordsLearned: number;
    lastPracticed: string;
  }>;
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    icon: string;
    progress: number;
    target: number;
    level: number;
  }>;
  statistics: {
    dailyAverage: number;
    totalSessions: number;
    accuracyRate: number;
    wordsLearned: number;
    exercisesCompleted: number;
    perfectScores: number;
  };
}

export default function UserDashboard({
  user,
  languages,
  achievements,
  statistics,
}: UserDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 p-6 pt-0 md:p-8 md:pt-0 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* User profile header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-primary/20 bg-muted">
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center border-2 border-background">
                  <Flame className="h-4 w-4" />
                  <span className="text-xs font-bold">{user.streak}</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground text-sm">
                  Joined {user.joinDate}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {user.totalXP} XP
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-secondary/10"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    Rank #{user.rank}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-accent/10"
                  >
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {user.level}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 self-end md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger
                  value="overview"
                  className="gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="languages"
                  className="gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Languages</span>
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="gap-2"
                >
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
                <TabsTrigger
                  value="statistics"
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Statistics</span>
                </TabsTrigger>
              </TabsList>
              <Button className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90">
                <Sparkles className="h-4 w-4 mr-2" />
                Practice Now
              </Button>
            </div>

            <TabsContent
              value="overview"
              className="space-y-6"
            >
              {/* Quick stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatisticsCard
                  title="Daily Streak"
                  value={user.streak}
                  description="days in a row"
                  icon={<Flame className="h-5 w-5 text-orange-500" />}
                  trend={+2}
                />
                <StatisticsCard
                  title="Words Learned"
                  value={statistics.wordsLearned}
                  description="across all languages"
                  icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                  trend={+45}
                />
                <StatisticsCard
                  title="Accuracy Rate"
                  value={`${statistics.accuracyRate}%`}
                  description="correct answers"
                  icon={<Target className="h-5 w-5 text-green-500" />}
                  trend={+3}
                />
              </div>

              {/* Languages section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Languages</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("languages")}
                  >
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {languages.slice(0, 3).map((language) => (
                    <LanguageCard
                      key={language.code}
                      language={language}
                    />
                  ))}
                </div>
              </div>

              {/* Recent achievements */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Achievements</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("achievements")}
                  >
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.slice(0, 2).map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </div>

              {/* Practice suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Daily Practice Suggestions
                  </CardTitle>
                  <CardDescription>
                    Recommended exercises based on your learning patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/exercises/vocabulary"
                    className="block"
                  >
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Vocabulary Review
                        </CardTitle>
                        <CardDescription>Polish - 15 minutes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Review 20 recently learned words
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link
                    href="/exercises/listening"
                    className="block"
                  >
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Listening Practice
                        </CardTitle>
                        <CardDescription>Russian - 10 minutes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Improve your listening comprehension
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link
                    href="/exercises/grammar"
                    className="block"
                  >
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Grammar Challenge
                        </CardTitle>
                        <CardDescription>Spanish - 20 minutes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Master verb conjugations</p>
                      </CardContent>
                    </Card>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="languages"
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Your Languages</h2>
              <div className="grid grid-cols-1 gap-6">
                {languages.map((language) => (
                  <Card
                    key={language.code}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center md:w-48">
                        <div className="text-6xl">{language.flag}</div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold">
                              {language.name}
                            </h3>
                            <p className="text-muted-foreground">
                              Level {language.level}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Vocabulary
                            </Button>
                            <Button size="sm">
                              <Zap className="h-4 w-4 mr-2" />
                              Practice
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">
                                {language.progress}%
                              </span>
                            </div>
                            <Progress
                              value={language.progress}
                              className="h-2"
                            />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span>{language.wordsLearned} words learned</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>
                                Last practiced: {language.lastPracticed}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-primary" />
                              <span>
                                Fluency:{" "}
                                {language.progress < 30
                                  ? "Beginner"
                                  : language.progress < 60
                                  ? "Intermediate"
                                  : "Advanced"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Add a New Language</CardTitle>
                  <CardDescription>
                    Expand your language learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["🇫🇷", "🇩🇪", "🇮🇹", "🇯🇵"].map((flag, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-24 text-2xl flex flex-col gap-2"
                      >
                        <span className="text-3xl">{flag}</span>
                        <span className="text-sm">
                          {index === 0
                            ? "French"
                            : index === 1
                            ? "German"
                            : index === 2
                            ? "Italian"
                            : "Japanese"}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full"
                  >
                    Browse all languages
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent
              value="achievements"
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    detailed
                  />
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Achievements</CardTitle>
                  <CardDescription>
                    Challenges you&apos;re close to completing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center text-xl">
                        🌟
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Polyglot</h4>
                          <span className="text-sm text-muted-foreground">
                            2/3
                          </span>
                        </div>
                        <Progress
                          value={66}
                          className="h-2 mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn 3 different languages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center text-xl">
                        🧠
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Memory Master</h4>
                          <span className="text-sm text-muted-foreground">
                            8/10
                          </span>
                        </div>
                        <Progress
                          value={80}
                          className="h-2 mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Score 100% on 10 vocabulary quizzes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="statistics"
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Your Learning Statistics</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatisticsCard
                  title="Daily Average"
                  value={statistics.dailyAverage}
                  description="minutes per day"
                  icon={<Clock className="h-5 w-5 text-indigo-500" />}
                  trend={+3}
                />
                <StatisticsCard
                  title="Total Sessions"
                  value={statistics.totalSessions}
                  description="learning sessions"
                  icon={<Calendar className="h-5 w-5 text-purple-500" />}
                  trend={+12}
                />
                <StatisticsCard
                  title="Perfect Scores"
                  value={statistics.perfectScores}
                  description="100% correct exercises"
                  icon={<Award className="h-5 w-5 text-yellow-500" />}
                  trend={+5}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Activity</CardTitle>
                  <CardDescription>
                    Your activity over the past 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <div>
                      <h3 className="font-medium">Activity Chart</h3>
                      <p className="text-sm text-muted-foreground">
                        Your learning activity visualization would appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Breakdown</CardTitle>
                    <CardDescription>
                      Time spent on different activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                            Vocabulary
                          </span>
                          <span>45%</span>
                        </div>
                        <Progress
                          value={45}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            Grammar
                          </span>
                          <span>30%</span>
                        </div>
                        <Progress
                          value={30}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                            Listening
                          </span>
                          <span>15%</span>
                        </div>
                        <Progress
                          value={15}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                            Speaking
                          </span>
                          <span>10%</span>
                        </div>
                        <Progress
                          value={10}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-orange-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                    <CardDescription>Words learned this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {languages.map((language) => (
                        <div
                          key={language.code}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span>{language.flag}</span>
                              {language.name}
                            </span>
                            <span>
                              {Math.floor(language.wordsLearned * 0.15)} words
                            </span>
                          </div>
                          <Progress
                            value={
                              (Math.floor(language.wordsLearned * 0.15) / 50) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
