"use client";

import { useState, useEffect } from "react";
import { Star, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export function TVShowsList() {
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    fetchPopularTVShows(1, true);
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        !loadingMore &&
        !loading &&
        hasMorePages
      ) {
        fetchPopularTVShows(currentPage + 1, false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, loadingMore, loading, hasMorePages]);

  const fetchPopularTVShows = async (page = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&include_adult=false&with_genres=10751,16&certification_country=US&certification.lte=TV-PG`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch TV shows");
      }

      const data = await response.json();

      if (isInitial) {
        // Filter out adult content for initial load
        const safeTVShows = data.results.filter((show) => !show.adult);
        setTVShows(safeTVShows);
      } else {
        setTVShows((prevTVShows) => {
          // Get existing TV show IDs to prevent duplicates
          const existingIds = new Set(prevTVShows.map((show) => show.id));
          // Filter out any TV shows that already exist
          const newTVShows = data.results.filter(
            (show) => !existingIds.has(show.id)
          );
          return [...prevTVShows, ...newTVShows];
        });
      }

      setCurrentPage(page);
      setHasMorePages(page < data.total_pages);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching TV shows:", err);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    return rating.toFixed(1);
  };

  if (loading) {
    return (
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Popular TV Shows
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-400">Loading TV shows...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Popular TV Shows
            </h2>
            <div className="text-red-400 mb-4">Error: {error}</div>
            <button
              onClick={() => fetchPopularTVShows(1, true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Popular TV Shows
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the most popular TV shows trending today
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {tvShows.map((show, index) => (
            <Link
              key={`${show.id}-${index}`}
              href={`/tv/${show.id}`}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 block"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                {show.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                  <span className="text-white text-xs font-medium">
                    {formatRating(show.vote_average)}
                  </span>
                </div>

                <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                  <TrendingUp className="h-3 w-3 text-white mr-1" />
                  <span className="text-white text-xs font-medium">
                    Popular
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                  {show.name}
                </h3>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(show.first_air_date)}</span>
                  </div>
                  <div className="text-purple-400 font-medium">
                    #{show.popularity.toFixed(0)}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>

        {loadingMore && (
          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span className="text-gray-400 text-lg">
                Loading more TV shows...
              </span>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          {!hasMorePages && tvShows.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-400 text-lg mb-4">
                📺 You've seen all {tvShows.length} popular TV shows!
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>
          )}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}
