import { Suspense } from "react";
import { Users, MessageSquare, TrendingUp, Search, Loader } from "lucide-react";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CommunityPosts from "@/components/community/CommunityPosts";
import CommunityGroups from "@/components/community/CommunityGroups";
import CommunityLeaderboard from "@/components/community/CommunityLeaderboard";

// Mock community data
const mockPosts = [
  {
    id: "1",
    title: "Tips for learning Russian cases",
    content:
      "I've been struggling with Russian cases for a while, and I wanted to share some tips that helped me...",
    author: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    language: "Russian",
    likes: 24,
    comments: 8,
    createdAt: "2023-10-15T14:30:00Z",
    tags: ["russian", "grammar", "tips"],
  },
  {
    id: "2",
    title: "Polish pronunciation guide",
    content:
      "Polish pronunciation can be challenging for English speakers. Here's my guide to mastering those tricky sounds...",
    author: {
      id: "user2",
      name: "Maria Kowalski",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    language: "Polish",
    likes: 36,
    comments: 12,
    createdAt: "2023-10-12T09:15:00Z",
    tags: ["polish", "pronunciation", "guide"],
  },
  {
    id: "3",
    title: "Spanish verb conjugation practice group",
    content:
      "I'm starting a study group focused on Spanish verb conjugations. We'll meet twice a week online to practice...",
    author: {
      id: "user3",
      name: "Carlos Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    language: "Spanish",
    likes: 18,
    comments: 15,
    createdAt: "2023-10-10T16:45:00Z",
    tags: ["spanish", "verbs", "study group"],
  },
  {
    id: "4",
    title: "My 30-day Polish challenge results",
    content:
      "I just completed a 30-day challenge to learn 500 Polish words. Here are my results and what I learned...",
    author: {
      id: "user4",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    language: "Polish",
    likes: 42,
    comments: 7,
    createdAt: "2023-10-08T11:20:00Z",
    tags: ["polish", "challenge", "vocabulary"],
  },
];

const mockLeaderboard = [
  {
    id: "user5",
    name: "David Chen",
    avatar: "/placeholder.svg?height=50&width=50",
    points: 1250,
    languages: ["Chinese", "Spanish", "English"],
    streak: 45,
    rank: 1,
  },
  {
    id: "user6",
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=50&width=50",
    points: 980,
    languages: ["French", "German", "Italian"],
    streak: 30,
    rank: 2,
  },
  {
    id: "user2",
    name: "Maria Kowalski",
    avatar: "/placeholder.svg?height=50&width=50",
    points: 875,
    languages: ["Polish", "English", "Russian"],
    streak: 28,
    rank: 3,
  },
  {
    id: "user7",
    name: "James Smith",
    avatar: "/placeholder.svg?height=50&width=50",
    points: 820,
    languages: ["Spanish", "Portuguese"],
    streak: 22,
    rank: 4,
  },
  {
    id: "user8",
    name: "Sophia Kim",
    avatar: "/placeholder.svg?height=50&width=50",
    points: 790,
    languages: ["Korean", "Japanese", "English"],
    streak: 19,
    rank: 5,
  },
];

const mockGroups = [
  {
    id: "group1",
    name: "Polish Learners Club",
    description: "A community for Polish language enthusiasts at all levels",
    members: 128,
    languages: ["Polish"],
    image: "/placeholder.svg?height=80&width=80",
    activity: "High",
  },
  {
    id: "group2",
    name: "Russian Grammar Masters",
    description: "Advanced discussions about Russian grammar and usage",
    members: 86,
    languages: ["Russian"],
    image: "/placeholder.svg?height=80&width=80",
    activity: "Medium",
  },
  {
    id: "group3",
    name: "Spanish Conversation Practice",
    description: "Weekly conversation sessions for Spanish learners",
    members: 215,
    languages: ["Spanish"],
    image: "/placeholder.svg?height=80&width=80",
    activity: "Very High",
  },
  {
    id: "group4",
    name: "Polyglot Exchange",
    description:
      "For learners of multiple languages to share tips and resources",
    members: 342,
    languages: ["Multiple"],
    image: "/placeholder.svg?height=80&width=80",
    activity: "High",
  },
  {
    id: "group5",
    name: "Language Learning Challenges",
    description: "Join monthly challenges to accelerate your language learning",
    members: 176,
    languages: ["Multiple"],
    image: "/placeholder.svg?height=80&width=80",
    activity: "Medium",
  },
];

export default function CommunityPage() {
  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Language Learning Community
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Connect with fellow language learners, share tips, join study groups,
          and participate in challenges to enhance your learning experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search posts, groups, or users..."
              className="pl-10 py-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <Link href="/community/new-post">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[300px]">
              <Loader className="animate-spin text-primary size-8" />
            </div>
          }
        >
          <Tabs
            defaultValue="posts"
            className="mt-4"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="posts">
                <MessageSquare className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                <TrendingUp className="h-4 w-4 mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="groups">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <CommunityPosts posts={mockPosts} />
            </TabsContent>

            <TabsContent value="leaderboard">
              <CommunityLeaderboard users={mockLeaderboard} />
            </TabsContent>

            <TabsContent value="groups">
              <CommunityGroups groups={mockGroups} />
            </TabsContent>
          </Tabs>
        </Suspense>
      </div>
    </div>
  );
}
