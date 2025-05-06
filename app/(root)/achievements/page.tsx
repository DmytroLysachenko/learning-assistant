import { Suspense } from "react";
import { Trophy, Star, Calendar, Target, Award } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementStats from "@/components/achievements/AchievementStats";
import AchievementGrid from "@/components/achievements/AchievementGrid";

// Mock achievement data
const mockAchievements = {
  milestone: [
    {
      id: "m1",
      title: "Vocabulary Builder",
      description: "Learn 10 words in any language",
      icon: <Star className="h-6 w-6" />,
      progress: 100,
      completed: true,
      completedDate: "2023-10-15",
      reward: "10 XP",
    },
    {
      id: "m2",
      title: "Word Master",
      description: "Learn 50 words in any language",
      icon: <Star className="h-6 w-6" />,
      progress: 72,
      completed: false,
      completedDate: null,
      reward: "50 XP",
    },
    {
      id: "m3",
      title: "Vocabulary Expert",
      description: "Learn 100 words in any language",
      icon: <Star className="h-6 w-6" />,
      progress: 36,
      completed: false,
      completedDate: null,
      reward: "100 XP + Badge",
    },
    {
      id: "m4",
      title: "Language Enthusiast",
      description: "Start learning 3 different languages",
      icon: <Award className="h-6 w-6" />,
      progress: 100,
      completed: true,
      completedDate: "2023-11-05",
      reward: "50 XP",
    },
  ],
  streak: [
    {
      id: "s1",
      title: "First Steps",
      description: "Practice for 3 days in a row",
      icon: <Calendar className="h-6 w-6" />,
      progress: 100,
      completed: true,
      completedDate: "2023-09-28",
      reward: "15 XP",
    },
    {
      id: "s2",
      title: "Consistency is Key",
      description: "Practice for 7 days in a row",
      icon: <Calendar className="h-6 w-6" />,
      progress: 57,
      completed: false,
      completedDate: null,
      reward: "30 XP",
    },
    {
      id: "s3",
      title: "Dedicated Learner",
      description: "Practice for 30 days in a row",
      icon: <Calendar className="h-6 w-6" />,
      progress: 13,
      completed: false,
      completedDate: null,
      reward: "100 XP + Badge",
    },
  ],
  activity: [
    {
      id: "a1",
      title: "Perfect Practice",
      description: "Complete a practice session with 100% accuracy",
      icon: <Target className="h-6 w-6" />,
      progress: 100,
      completed: true,
      completedDate: "2023-10-22",
      reward: "20 XP",
    },
    {
      id: "a2",
      title: "Quick Learner",
      description: "Learn 5 new words in a single day",
      icon: <Target className="h-6 w-6" />,
      progress: 80,
      completed: false,
      completedDate: null,
      reward: "15 XP",
    },
    {
      id: "a3",
      title: "Community Contributor",
      description: "Share 3 study tips with the community",
      icon: <Target className="h-6 w-6" />,
      progress: 33,
      completed: false,
      completedDate: null,
      reward: "25 XP",
    },
  ],
};

// Mock user achievement stats
const mockUserStats = {
  totalAchievements: 12,
  completedAchievements: 4,
  totalXpEarned: 95,
  nextAchievement: {
    title: "Quick Learner",
    progress: 80,
  },
  level: 3,
  xpToNextLevel: 45,
};

export default function AchievementsPage() {
  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Track your progress and earn rewards by completing achievements.
          Achievements are unlocked as you learn and practice languages.
        </p>

        <Suspense fallback={<div>Loading achievements...</div>}>
          <AchievementStats stats={mockUserStats} />

          <Tabs
            defaultValue="all"
            className="mt-8"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="milestone">Milestones</TabsTrigger>
              <TabsTrigger value="streak">Streaks</TabsTrigger>
              <TabsTrigger value="activity">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <AchievementGrid
                achievements={[
                  ...mockAchievements.milestone,
                  ...mockAchievements.streak,
                  ...mockAchievements.activity,
                ]}
              />
            </TabsContent>

            <TabsContent value="milestone">
              <AchievementGrid achievements={mockAchievements.milestone} />
            </TabsContent>

            <TabsContent value="streak">
              <AchievementGrid achievements={mockAchievements.streak} />
            </TabsContent>

            <TabsContent value="activity">
              <AchievementGrid achievements={mockAchievements.activity} />
            </TabsContent>
          </Tabs>
        </Suspense>
      </div>
    </div>
  );
}
