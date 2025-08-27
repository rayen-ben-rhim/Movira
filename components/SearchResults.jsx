"use client";

import { useState, useEffect } from "react";
import { Star, Calendar, TrendingUp, Play, Film, Tv } from "lucide-react";
import Link from "next/link";

export function SearchResults({
  results,
  loading,
  error,
  query,
  activeTab,
  hasMorePages,
  onLoadMore,
}) {
  const [loadingMore, setLoadingMore] = useState(false);

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        !loadingMore &&
        !loading &&
        hasMorePages &&
        results.length > 0
      ) {
        setLoadingMore(true);
        onLoadMore();
        setTimeout(() => setLoadingMore(false), 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, loading, hasMorePages, results.length, onLoadMore]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : "N/A";
  };

  const getItemType = (item) => {
    if (item.media_type) return item.media_type;
    if (item.title) return "movie";
    if (item.name) return "tv";
    return "unknown";
  };

  const getItemTitle = (item) => {
    return item.title || item.name || "Unknown Title";
  };

  const getItemDate = (item) => {
    return item.release_date || item.first_air_date;
  };

  const getItemLink = (item) => {
    const type = getItemType(item);
    if (type === "movie") return `/movies/${item.id}`;
    if (type === "tv") return `/tv/${item.id}`;
    return "#";
  };

  if (loading && results.length === 0) {
    return (
      <div className="w-full py-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
          <p className="text-gray-400 text-lg">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error: {error}</div>
          <p className="text-gray-400">Please try searching again.</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="w-full py-16">
        <div className="text-center">
          <div className="mb-6">
            <Play className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Search for Movies & TV Shows
            </h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Enter a movie title, TV show name, or keyword to discover amazing
              content
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0 && !loading) {
    return (
      <div className="w-full py-16">
        <div className="text-center">
          <div className="mb-6">
            <Play className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              No Results Found
            </h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto mb-6">
              We couldn't find any{" "}
              {activeTab === "all" ? "movies or TV shows" : activeTab} matching
              "{query}". Try different keywords or check your spelling.
            </p>
            <div className="space-y-2 text-gray-500 text-sm">
              <p>• Try using different keywords</p>
              <p>• Check your spelling</p>
              <p>• Use more general terms</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {results.map((item, index) => {
            const itemType = getItemType(item);
            const title = getItemTitle(item);
            const date = getItemDate(item);
            const link = getItemLink(item);

            return (
              <Link
                key={`${item.id}-${index}-${itemType}`}
                href={link}
                className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 block"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  {item.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${item.poster_path}`}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        {itemType === "movie" ? (
                          <Film className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                        ) : (
                          <Tv className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                        )}
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    </div>
                  )}

                  {/* Rating Badge */}
                  {item.vote_average > 0 && (
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-white text-xs font-medium">
                        {formatRating(item.vote_average)}
                      </span>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                    {itemType === "movie" ? (
                      <Film className="h-3 w-3 text-white mr-1" />
                    ) : (
                      <Tv className="h-3 w-3 text-white mr-1" />
                    )}
                    <span className="text-white text-xs font-medium capitalize">
                      {itemType === "tv" ? "TV" : itemType}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {title}
                  </h3>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(date)}</span>
                    </div>
                    {item.popularity && (
                      <div className="text-purple-400 font-medium">
                        #{Math.round(item.popularity)}
                      </div>
                    )}
                  </div>

                  {/* Overview snippet for larger screens */}
                  {item.overview && (
                    <p className="hidden sm:block text-gray-500 text-xs mt-2 line-clamp-2">
                      {item.overview}
                    </p>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="text-gray-400 text-lg">
              Loading more results...
            </span>
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {results.length > 0 && !hasMorePages && !loading && (
        <div className="text-center mt-12">
          <div className="mb-6">
            <p className="text-gray-400 text-lg mb-4">
              🎬 You've seen all {results.length} search results!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Back to Top
          </button>
        </div>
      )}
    </div>
  );
}
