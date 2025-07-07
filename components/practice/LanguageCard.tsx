import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

type CardType = "learning" | "mastered" | "reviewing";

interface LanguageCardProps {
  type: CardType;
  languageName: string;
  languageCode: string;
  wordCount: number;
  description: string;
}

const cardConfig = {
  learning: {
    icon: BookOpen,
    colors: {
      accent: "bg-purple-500",
      badge: "bg-purple-100 text-purple-700",
      button: "bg-purple-600 hover:bg-purple-700",
      progress: "bg-purple-500",
      count: "text-purple-700",
      gradient: "from-white to-purple-50",
      border: "hover:border-purple-300",
    },
    label: "Learning",
  },
  mastered: {
    icon: CheckCircle,
    colors: {
      accent: "bg-green-500",
      badge: "bg-green-100 text-green-700",
      button: "bg-green-600 hover:bg-green-700",
      progress: "bg-green-500",
      count: "text-green-700",
      gradient: "from-white to-green-50",
      border: "hover:border-green-300",
    },
    label: "Mastered",
  },
  reviewing: {
    icon: RefreshCw,
    colors: {
      accent: "bg-amber-500",
      badge: "bg-amber-100 text-amber-700",
      button: "bg-amber-600 hover:bg-amber-700",
      progress: "bg-amber-500",
      count: "text-amber-700",
      gradient: "from-white to-amber-50",
      border: "hover:border-amber-300",
    },
    label: "Reviewing",
  },
};

const LanguageCard = ({
  type,
  languageName,
  languageCode,
  wordCount,
  description,
}: LanguageCardProps) => {
  const config = cardConfig[type];
  const Icon = config.icon;

  return (
    <Link
      href={`/practice/${languageCode}?category=${type}`}
      className="block group"
    >
      <div
        className={cn(
          "relative border rounded-xl overflow-hidden bg-gradient-to-br",
          config.colors.gradient,
          config.colors.border,
          "hover:shadow-lg transition-all duration-300 h-full transform hover:-translate-y-1"
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-1",
            config.colors.accent
          )}
        ></div>

        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-5 w-5", config.colors.count)} />
              <h2 className="font-semibold text-lg text-gray-900">
                {languageName}
              </h2>
            </div>

            <div
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                config.colors.badge
              )}
            >
              {config.label}
            </div>
          </div>

          <div className="mb-5 flex-1">
            <span className="text-sm text-gray-600">{description}</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                {type === "learning"
                  ? "Words to learn"
                  : type === "mastered"
                  ? "Words mastered"
                  : "Words reviewing"}
              </span>
              <span className={cn("text-sm font-medium", config.colors.count)}>
                {wordCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn("h-2 rounded-full", config.colors.progress)}
                style={{
                  width: `${Math.min(100, (wordCount / 100) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
          <button
            className={cn(
              "w-full py-2.5 px-4 text-white rounded-lg transition-colors text-sm font-medium",
              "flex items-center justify-center gap-2 group-hover:shadow-md",
              config.colors.button
            )}
          >
            Practice Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default LanguageCard;
