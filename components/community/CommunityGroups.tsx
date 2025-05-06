"use client";

import { useState } from "react";
import { Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  languages: string[];
  image: string;
  activity: string;
}

interface CommunityGroupsProps {
  groups: CommunityGroup[];
}

const CommunityGroups = ({ groups }: CommunityGroupsProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter groups by language and search query
  const filteredGroups = groups.filter((group) => {
    const matchesLanguage =
      filter === "all" ||
      group.languages.includes(filter) ||
      (filter === "Multiple" && group.languages.includes("Multiple"));

    const matchesSearch =
      searchQuery === "" ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLanguage && matchesSearch;
  });

  // Get unique languages for filter
  const languages = Array.from(
    new Set(groups.flatMap((group) => group.languages))
  );

  // Get activity color
  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "Very High":
        return "text-green-600";
      case "High":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 py-2 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

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
                  value={language}
                >
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">
            No groups found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <Link
              key={group.id}
              href={`/community/groups/${group.id}`}
              className="block group"
            >
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={group.image || "/placeholder.svg"}
                        alt={group.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {group.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {group.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {group.languages.map((language) => (
                          <Badge
                            key={language}
                            variant="outline"
                            className="text-xs"
                          >
                            {language}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-4 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{group.members} members</span>
                        </div>
                        <div className={`${getActivityColor(group.activity)}`}>
                          {group.activity} activity
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button className="bg-purple-600 hover:bg-purple-700">
          Create New Group
        </Button>
      </div>
    </div>
  );
};

export default CommunityGroups;
