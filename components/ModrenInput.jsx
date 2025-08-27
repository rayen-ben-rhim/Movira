"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, MessageCircle, ArrowUp } from "lucide-react";

export function ModernInput({
  initialValue = "",
  onSearch,
  placeholder: customPlaceholder,
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(initialValue);
  const [selectedMood, setSelectedMood] = useState("happy");
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const categories = [
    "movies",
    "tv shows",
    "series",
    "documentaries",
    "actors",
    "directors",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % categories.length);
    }, 2500); // Slightly slower for smoother feel

    return () => clearInterval(interval);
  }, [categories.length]);

  const moods = [
    { value: "happy", label: "😊 Happy", color: "bg-yellow-500" },
    { value: "sad", label: "😢 Sad", color: "bg-blue-500" },
    { value: "excited", label: "🎉 Excited", color: "bg-orange-500" },
    { value: "calm", label: "😌 Calm", color: "bg-green-500" },
    { value: "angry", label: "😠 Angry", color: "bg-red-500" },
    { value: "thoughtful", label: "🤔 Thoughtful", color: "bg-purple-500" },
  ];

  const currentMood = moods.find((mood) => mood.value === selectedMood);

  // Update input value when initialValue changes
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      if (onSearch) {
        onSearch(inputValue.trim());
      } else {
        // Navigate to search page
        router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-gray-700/50 shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              customPlaceholder ||
              `Ask Movira to search about ${categories[placeholderIndex]}`
            }
            className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-sm sm:text-base leading-relaxed min-h-[24px] max-h-32 transition-all duration-700 ease-in-out"
            rows={1}
            style={{
              height: "auto",
              minHeight: "24px",
            }}
            onInput={(e) => {
              const target = e.target;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 sm:h-8 px-2 sm:px-3 text-white hover:bg-gray-600/20 rounded-full text-xs sm:text-sm font-medium bg-gray-700/30 border border-gray-600/30"
                onClick={() => setShowMoodDropdown(!showMoodDropdown)}
              >
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${currentMood?.color} rounded-full mr-1 sm:mr-2`}
                />
                <span className="hidden sm:inline">{currentMood?.label}</span>
                <span className="sm:hidden">
                  {currentMood?.label.split(" ")[0]}
                </span>
                <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1" />
              </Button>

              {showMoodDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl shadow-2xl z-50 min-w-[140px] sm:min-w-[160px]">
                  <div className="p-1.5 sm:p-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => {
                          setSelectedMood(mood.value);
                          setShowMoodDropdown(false);
                        }}
                        className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                          selectedMood === mood.value
                            ? "bg-gray-700/50 text-white"
                            : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${mood.color} rounded-full mr-1 sm:mr-2`}
                          />
                          <span className="hidden sm:inline">{mood.label}</span>
                          <span className="sm:hidden">
                            {mood.label.split(" ")[0]}{" "}
                            {mood.label.split(" ")[1]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-gray-500 text-xs sm:text-sm hidden md:inline">
              Press Enter to search
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full"
            >
              <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
