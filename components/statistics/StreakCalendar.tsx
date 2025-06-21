"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlameIcon as Fire } from "lucide-react";

interface StreakCalendarProps {
  streakData: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
}

const StreakCalendar = ({
  streakData,
  currentStreak,
  longestStreak,
}: StreakCalendarProps) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 2);
  startDate.setDate(1);

  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const months: { name: string; dates: Date[] }[] = [];
  let currentMonth: number | null = null;

  dates.forEach((date) => {
    if (date.getMonth() !== currentMonth) {
      currentMonth = date.getMonth();
      months.push({
        name: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        dates: [],
      });
    }
    months[months.length - 1].dates.push(date);
  });

  const getDayOfWeek = (date: Date) => date.getDay();

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getColorIntensity = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-purple-200";
    if (count === 2) return "bg-purple-400";
    return "bg-purple-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Practice Streak</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Fire className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">
              Current: {currentStreak} days
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Longest: {longestStreak} days
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-6">
          {months.map((month, monthIndex) => (
            <div key={monthIndex}>
              <h4 className="text-sm font-medium mb-2">{month.name}</h4>
              <div className="grid grid-cols-7 gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div
                    key={i}
                    className="h-6 flex items-center justify-center"
                  >
                    <span className="text-xs text-gray-500">{day}</span>
                  </div>
                ))}

                {Array.from({ length: getDayOfWeek(month.dates[0]) }).map(
                  (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="h-6"
                    ></div>
                  )
                )}

                {month.dates.map((date, i) => {
                  const dateKey = formatDateKey(date);
                  const practiceCount = streakData[dateKey] || 0;
                  const isToday = date.toDateString() === today.toDateString();

                  return (
                    <div
                      key={i}
                      className={`h-6 w-6 rounded-sm ${getColorIntensity(
                        practiceCount
                      )} ${
                        isToday ? "ring-2 ring-purple-500" : ""
                      } relative group`}
                    >
                      {practiceCount > 0 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          : {practiceCount}{" "}
                          {practiceCount === 1 ? "session" : "sessions"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-gray-100 rounded-sm"></div>
            <span className="text-xs text-gray-500">None</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-purple-200 rounded-sm"></div>
            <span className="text-xs text-gray-500">1 session</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-purple-400 rounded-sm"></div>
            <span className="text-xs text-gray-500">2 sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-purple-600 rounded-sm"></div>
            <span className="text-xs text-gray-500">3+ sessions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
