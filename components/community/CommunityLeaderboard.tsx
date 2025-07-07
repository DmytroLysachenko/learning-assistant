import { Medal, Flame } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  languages: string[];
  streak: number;
  rank: number;
}

interface CommunityLeaderboardProps {
  users: LeaderboardUser[];
}

const CommunityLeaderboard = ({ users }: CommunityLeaderboardProps) => {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top Language Learners
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4"
            >
              <div className="flex items-center justify-center w-8">
                {user.rank <= 3 ? (
                  <Medal className={`h-6 w-6 ${getMedalColor(user.rank)}`} />
                ) : (
                  <span className="text-gray-500 font-medium">{user.rank}</span>
                )}
              </div>

              <Avatar className="h-12 w-12 border-2 border-purple-100">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.languages.map((language) => (
                    <Badge
                      key={language}
                      variant="outline"
                      className="text-xs py-0 px-2"
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="font-bold text-purple-600">
                  {user.points.toLocaleString()} XP
                </div>
                <div className="flex items-center text-xs text-orange-500 mt-1">
                  <Flame className="h-3 w-3 mr-1" />
                  {user.streak} day streak
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium text-purple-700 mb-2">Your Ranking</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8">
              <span className="text-gray-500 font-medium">24</span>
            </div>

            <Avatar className="h-12 w-12 border-2 border-purple-100">
              <AvatarImage
                src="/placeholder.svg?height=50&width=50"
                alt="Your Avatar"
              />
              <AvatarFallback>YA</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="font-medium text-gray-900">You</div>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs py-0 px-2"
                >
                  Polish
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs py-0 px-2"
                >
                  Russian
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs py-0 px-2"
                >
                  Spanish
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="font-bold text-purple-600">420 XP</div>
              <div className="flex items-center text-xs text-orange-500 mt-1">
                <Flame className="h-3 w-3 mr-1" />4 day streak
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityLeaderboard;
