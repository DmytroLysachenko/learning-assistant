"use client";

import { useState } from "react";
import { MessageSquare, Heart, Share2, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  language: string;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

interface CommunityPostsProps {
  posts: Post[];
}

const CommunityPosts = ({ posts }: CommunityPostsProps) => {
  const [filter, setFilter] = useState<string>("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredPosts =
    filter === "all"
      ? posts
      : posts.filter(
          (post) => post.language.toLowerCase() === filter.toLowerCase()
        );

  const languages = Array.from(new Set(posts.map((post) => post.language)));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Community Posts</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter by language:</span>
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              {languages.map((language) => (
                <SelectItem
                  key={language}
                  value={language.toLowerCase()}
                >
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No posts found for this language.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                      />
                      <AvatarFallback>
                        {post.author.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.author.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                  >
                    {post.language}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.content}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-600"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-purple-600"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button
          variant="outline"
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default CommunityPosts;
