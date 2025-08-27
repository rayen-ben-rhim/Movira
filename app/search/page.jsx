"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import { SearchResults } from "@/components/SearchResults";
import { ModernInput } from "@/components/ModrenInput";
import { Search, Film, Tv } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all, movies, tv
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://api.themoviedb.org/3";

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery, 1, true);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, page = 1, isNewSearch = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let searchUrl;
      if (activeTab === "movies") {
        searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}&include_adult=false`;
      } else if (activeTab === "tv") {
        searchUrl = `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}&include_adult=false`;
      } else {
        searchUrl = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}&include_adult=false`;
      }

      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();

      // Filter out person results for multi search
      const filteredResults =
        activeTab === "all"
          ? data.results.filter((item) => item.media_type !== "person")
          : data.results;

      if (isNewSearch) {
        setResults(filteredResults);
        setCurrentPage(1);
      } else {
        setResults((prev) => [...prev, ...filteredResults]);
      }

      setTotalResults(data.total_results);
      setHasMorePages(page < data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      // Update URL without page reload
      const url = new URL(window.location);
      url.searchParams.set("q", searchQuery);
      window.history.pushState({}, "", url);

      performSearch(searchQuery, 1, true);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (query.trim()) {
      performSearch(query, 1, true);
    }
  };

  const loadMore = () => {
    if (hasMorePages && !loading) {
      performSearch(query, currentPage + 1, false);
    }
  };

  const getTabCount = (type) => {
    if (!results.length) return 0;
    if (type === "all") return totalResults;
    if (type === "movies")
      return results.filter((item) => item.title || item.media_type === "movie")
        .length;
    if (type === "tv")
      return results.filter((item) => item.name || item.media_type === "tv")
        .length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Search className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                Search Results
              </h1>
            </div>

            {query && (
              <p className="text-xl text-gray-300 mb-8">
                {totalResults > 0 ? (
                  <>
                    Found{" "}
                    <span className="text-purple-400 font-semibold">
                      {totalResults.toLocaleString()}
                    </span>{" "}
                    results for{" "}
                    <span className="text-white font-semibold">"{query}"</span>
                  </>
                ) : (
                  <>
                    No results found for{" "}
                    <span className="text-white font-semibold">"{query}"</span>
                  </>
                )}
              </p>
            )}

            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <ModernInput
                initialValue={query}
                onSearch={handleSearch}
                placeholder="Search for movies, TV shows..."
              />
            </div>
          </div>

          {/* Search Filters */}
          {query && (
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => handleTabChange("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  All ({totalResults})
                </button>
                <button
                  onClick={() => handleTabChange("movies")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "movies"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Film className="h-4 w-4 inline mr-2" />
                  Movies
                </button>
                <button
                  onClick={() => handleTabChange("tv")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "tv"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Tv className="h-4 w-4 inline mr-2" />
                  TV Shows
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          <SearchResults
            results={results}
            loading={loading}
            error={error}
            query={query}
            activeTab={activeTab}
            hasMorePages={hasMorePages}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black">
          <NavBar />
          <div className="pt-16 flex items-center justify-center min-h-screen">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="text-white text-lg">Loading search...</span>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
