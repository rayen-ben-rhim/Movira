"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { Heart, Star, Calendar, Tv, Film, Trash2, Filter } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("all"); // all, movies, tv
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem("movira_favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id, type) => {
    const updatedFavorites = favorites.filter(
      (item) => !(item.id === id && item.type === type)
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("movira_favorites", JSON.stringify(updatedFavorites));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("movira_favorites");
  };

  const filteredFavorites = favorites.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    return rating.toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="text-white text-lg">Loading favorites...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <div className="pt-16 pb-8 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                My Favorites
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your personal collection of favorite movies and TV shows.
              <span className="text-purple-400 font-medium">
                {" "}
                Keep track of what you love
              </span>{" "}
              and discover them anytime.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {favorites.length}
                </div>
                <div className="text-gray-400 text-sm">Total Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {favorites.filter((item) => item.type === "movie").length}
                </div>
                <div className="text-gray-400 text-sm">Movies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {favorites.filter((item) => item.type === "tv").length}
                </div>
                <div className="text-gray-400 text-sm">TV Shows</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favorites.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center justify-between mb-8">
              <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Filter className="h-4 w-4 inline mr-2" />
                  All ({favorites.length})
                </button>
                <button
                  onClick={() => setFilter("movie")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "movie"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Film className="h-4 w-4 inline mr-2" />
                  Movies (
                  {favorites.filter((item) => item.type === "movie").length})
                </button>
                <button
                  onClick={() => setFilter("tv")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "tv"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Tv className="h-4 w-4 inline mr-2" />
                  TV Shows (
                  {favorites.filter((item) => item.type === "tv").length})
                </button>
              </div>

              {favorites.length > 0 && (
                <button
                  onClick={clearAllFavorites}
                  className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4 inline mr-2" />
                  Clear All
                </button>
              )}
            </div>

            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredFavorites.map((item) => (
                  <div
                    key={`${item.id}-${item.type}`}
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <Link
                      href={
                        item.type === "movie"
                          ? `/movies/${item.id}`
                          : `/tv/${item.id}`
                      }
                      className="block"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        {item.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${item.poster_path}`}
                            alt={item.title || item.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                              No Image
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                          {item.type === "movie" ? (
                            <Film className="h-3 w-3 text-white mr-1" />
                          ) : (
                            <Tv className="h-3 w-3 text-white mr-1" />
                          )}
                          <span className="text-white text-xs font-medium capitalize">
                            {item.type}
                          </span>
                        </div>

                        {item.vote_average > 0 && (
                          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-white text-xs font-medium">
                              {formatRating(item.vote_average)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {item.title || item.name}
                        </h3>

                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {formatDate(
                                item.release_date || item.first_air_date
                              )}
                            </span>
                          </div>
                          <div className="text-purple-400 font-medium">
                            ❤️ Saved
                          </div>
                        </div>
                      </div>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(item.id, item.type);
                      }}
                      className="absolute top-3 right-12 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      title="Remove from favorites"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg mb-4">
                  No{" "}
                  {filter === "all"
                    ? ""
                    : filter === "movie"
                    ? "movies"
                    : "TV shows"}{" "}
                  in your favorites yet.
                </div>
                <Link
                  href={filter === "tv" ? "/tv" : "/movies"}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Browse {filter === "tv" ? "TV Shows" : "Movies"}
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              No Favorites Yet
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Start building your collection by adding movies and TV shows to
              your favorites!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/movies"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Film className="h-4 w-4 inline mr-2" />
                Browse Movies
              </Link>
              <Link
                href="/tv"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Tv className="h-4 w-4 inline mr-2" />
                Browse TV Shows
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
