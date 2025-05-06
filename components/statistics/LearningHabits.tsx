"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeData {
  hour: number;
  minutes: number;
}

interface LearningHabitsProps {
  practiceTimeByHour: TimeData[];
}

const LearningHabits = ({ practiceTimeByHour }: LearningHabitsProps) => {
  // Find the maximum minutes to scale the chart
  const maxMinutes = Math.max(...practiceTimeByHour.map((d) => d.minutes));

  // Create an array of all 24 hours with their practice time
  const allHours = Array.from({ length: 24 }, (_, i) => {
    const existingData = practiceTimeByHour.find((d) => d.hour === i);
    return {
      hour: i,
      minutes: existingData ? existingData.minutes : 0,
    };
  });

  // Format hour for display (12-hour format with AM/PM)
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-medium">Learning Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <div className="flex h-full items-end">
            {allHours.map((data, index) => {
              // Calculate bar height as percentage of max value
              const heightPercentage =
                maxMinutes > 0 ? (data.minutes / maxMinutes) * 100 : 0;

              // Determine if this is a peak learning time (top 3 hours)
              const isPeakTime = practiceTimeByHour
                .sort((a, b) => b.minutes - a.minutes)
                .slice(0, 3)
                .some((peak) => peak.hour === data.hour);

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className={`w-full ${
                      isPeakTime ? "bg-purple-600" : "bg-purple-300"
                    } rounded-t hover:opacity-80 transition-opacity relative group`}
                    style={{
                      height: `${heightPercentage}%`,
                      minHeight: data.minutes > 0 ? "4px" : "0",
                    }}
                  >
                    {data.minutes > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.minutes} min
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      index % 3 === 0 ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {index % 3 === 0 ? formatHour(data.hour) : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          Your peak learning times are{" "}
          {formatHour(
            practiceTimeByHour.sort((a, b) => b.minutes - a.minutes)[0].hour
          )}
          ,
          {formatHour(
            practiceTimeByHour.sort((a, b) => b.minutes - a.minutes)[1].hour
          )}
          , and
          {formatHour(
            practiceTimeByHour.sort((a, b) => b.minutes - a.minutes)[2].hour
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default LearningHabits;
