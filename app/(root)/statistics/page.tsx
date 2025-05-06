import { Suspense } from "react";
import { BarChart, LineChart, PieChart, Calendar, Clock } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsSummary from "@/components/statistics/StatisticsSummary";
import ActivityChart from "@/components/statistics/ActivityChart";
import LanguageProgress from "@/components/statistics/LanguageProgress";
import LearningHabits from "@/components/statistics/LearningHabits";
import StreakCalendar from "@/components/statistics/StreakCalendar";

// Mock statistics data
const mockUserStats = {
  totalWordsLearned: 156,
  totalLanguages: 3,
  daysActive: 28,
  currentStreak: 4,
  longestStreak: 12,
  averageAccuracy: 78,
  timeSpent: 1240, // minutes
  wordsPerLanguage: {
    Polish: 72,
    Russian: 54,
    Spanish: 30,
  },
  activityData: [
    { date: "2023-10-01", wordsLearned: 5, timeSpent: 15, accuracy: 80 },
    { date: "2023-10-02", wordsLearned: 8, timeSpent: 20, accuracy: 75 },
    { date: "2023-10-03", wordsLearned: 6, timeSpent: 18, accuracy: 83 },
    { date: "2023-10-04", wordsLearned: 0, timeSpent: 0, accuracy: 0 },
    { date: "2023-10-05", wordsLearned: 0, timeSpent: 0, accuracy: 0 },
    { date: "2023-10-06", wordsLearned: 10, timeSpent: 25, accuracy: 90 },
    { date: "2023-10-07", wordsLearned: 7, timeSpent: 22, accuracy: 71 },
    { date: "2023-10-08", wordsLearned: 5, timeSpent: 15, accuracy: 80 },
    { date: "2023-10-09", wordsLearned: 0, timeSpent: 0, accuracy: 0 },
    { date: "2023-10-10", wordsLearned: 12, timeSpent: 30, accuracy: 92 },
    { date: "2023-10-11", wordsLearned: 8, timeSpent: 20, accuracy: 75 },
    { date: "2023-10-12", wordsLearned: 6, timeSpent: 18, accuracy: 83 },
    { date: "2023-10-13", wordsLearned: 9, timeSpent: 25, accuracy: 78 },
    { date: "2023-10-14", wordsLearned: 7, timeSpent: 22, accuracy: 86 },
  ],
  practiceTimeByHour: [
    { hour: 6, minutes: 45 },
    { hour: 7, minutes: 120 },
    { hour: 8, minutes: 180 },
    { hour: 9, minutes: 60 },
    { hour: 12, minutes: 75 },
    { hour: 17, minutes: 90 },
    { hour: 18, minutes: 210 },
    { hour: 19, minutes: 240 },
    { hour: 20, minutes: 150 },
    { hour: 21, minutes: 70 },
  ],
  streakData: {
    // Format: YYYY-MM-DD: practice count
    "2023-10-01": 1,
    "2023-10-02": 2,
    "2023-10-03": 1,
    "2023-10-06": 3,
    "2023-10-07": 1,
    "2023-10-08": 1,
    "2023-10-10": 2,
    "2023-10-11": 1,
    "2023-10-12": 1,
    "2023-10-13": 2,
    "2023-10-14": 1,
    "2023-10-15": 1,
    "2023-10-16": 1,
    "2023-10-17": 1,
  },
};

const StatisticsPage = () => {
  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Track your learning progress and habits. See how you&apos;re improving
          over time and identify patterns in your language learning journey.
        </p>

        <Suspense fallback={<div>Loading statistics...</div>}>
          <StatsSummary stats={mockUserStats} />

          <Tabs
            defaultValue="progress"
            className="mt-8"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="progress">
                <LineChart className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="languages">
                <PieChart className="h-4 w-4 mr-2" />
                Languages
              </TabsTrigger>
              <TabsTrigger value="habits">
                <Clock className="h-4 w-4 mr-2" />
                Habits
              </TabsTrigger>
              <TabsTrigger value="streak">
                <Calendar className="h-4 w-4 mr-2" />
                Streak
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress">
              <ActivityChart activityData={mockUserStats.activityData} />
            </TabsContent>

            <TabsContent value="languages">
              <LanguageProgress
                wordsPerLanguage={mockUserStats.wordsPerLanguage}
              />
            </TabsContent>

            <TabsContent value="habits">
              <LearningHabits
                practiceTimeByHour={mockUserStats.practiceTimeByHour}
              />
            </TabsContent>

            <TabsContent value="streak">
              <StreakCalendar
                streakData={mockUserStats.streakData}
                currentStreak={mockUserStats.currentStreak}
                longestStreak={mockUserStats.longestStreak}
              />
            </TabsContent>
          </Tabs>
        </Suspense>
      </div>
    </div>
  );
};

export default StatisticsPage;
