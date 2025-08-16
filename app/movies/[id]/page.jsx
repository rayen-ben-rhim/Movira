"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import {
  Star,
  Calendar,
  Clock,
  Globe,
  ArrowLeft,
  Play,
  Users,
  Heart,
} from "lucide-react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function MovieDetailsPage() {
  const params = useParams();
  const movieId = params.id;

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";
  const BACKDROP_BASE_URL =
    "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
      checkIfFavorite();
    }
  }, [movieId]);

  const checkIfFavorite = () => {
    try {
      const savedFavorites = localStorage.getItem("movira_favorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        const isInFavorites = favorites.some(
          (item) => item.id === parseInt(movieId) && item.type === "movie"
        );
        setIsFavorite(isInFavorites);
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const toggleFavorite = () => {
    try {
      const savedFavorites = localStorage.getItem("movira_favorites");
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      const existingIndex = favorites.findIndex(
        (item) => item.id === parseInt(movieId) && item.type === "movie"
      );

      if (existingIndex >= 0) {
        favorites.splice(existingIndex, 1);
        setIsFavorite(false);
      } else {
        const favoriteItem = {
          id: movie.id,
          type: "movie",
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        };
        favorites.push(favoriteItem);
        setIsFavorite(true);
      }

      localStorage.setItem("movira_favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);

      const [movieResponse, creditsResponse, recommendationsResponse] =
        await Promise.all([
          fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

      if (
        !movieResponse.ok ||
        !creditsResponse.ok ||
        !recommendationsResponse.ok
      ) {
        throw new Error("Failed to fetch movie details");
      }

      const [movieData, creditsData, recommendationsData] = await Promise.all([
        movieResponse.json(),
        creditsResponse.json(),
        recommendationsResponse.json(),
      ]);

      setMovie(movieData);
      setCast(creditsData.cast.slice(0, 12));
      setRecommendations(recommendationsData.results.slice(0, 6));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching movie details:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="text-white text-lg">Loading movie details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Movie Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              {error || "The movie you're looking for doesn't exist."}
            </p>
            <Link
              href="/movies"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <div className="relative pt-16">
        {movie.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <img
              src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/movies"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Movies</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">No Poster Available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  {movie.title}
                  {movie.release_date && (
                    <span className="text-gray-400 font-normal text-3xl ml-4">
                      ({new Date(movie.release_date).getFullYear()})
                    </span>
                  )}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {movie.vote_average > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="text-gray-400">
                        ({movie.vote_count.toLocaleString()} votes)
                      </span>
                    </div>
                  )}

                  {movie.release_date && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}

                  {movie.original_language && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Globe className="h-4 w-4" />
                      <span>{movie.original_language.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <SignedIn>
                <div className="flex gap-4">
                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      isFavorite
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                    <span>
                      {isFavorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </span>
                  </button>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="flex gap-4">
                  <SignInButton mode="modal">
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      Sign In to Add to Favorites
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>

              {movie.overview && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Overview
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {movie.budget > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Budget</h4>
                    <p className="text-gray-300">
                      {formatCurrency(movie.budget)}
                    </p>
                  </div>
                )}

                {movie.revenue > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Revenue</h4>
                    <p className="text-gray-300">
                      {formatCurrency(movie.revenue)}
                    </p>
                  </div>
                )}

                {movie.production_companies &&
                  movie.production_companies.length > 0 && (
                    <div className="sm:col-span-2">
                      <h4 className="text-white font-semibold mb-2">
                        Production Companies
                      </h4>
                      <p className="text-gray-300">
                        {movie.production_companies
                          .map((company) => company.name)
                          .join(", ")}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <div className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3 mb-8">
              <Users className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Cast</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-gray-800">
                    {actor.profile_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {actor.name}
                  </h4>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-black py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              You Might Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {recommendations.map((recMovie) => (
                <Link
                  key={recMovie.id}
                  href={`/movies/${recMovie.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-gray-800 hover:scale-105 transition-transform duration-300">
                    {recMovie.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${recMovie.poster_path}`}
                        alt={recMovie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-500" />
                      </div>
                    )}

                    {recMovie.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-white text-xs">
                          {recMovie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors">
                    {recMovie.title}
                  </h4>
                  {recMovie.release_date && (
                    <p className="text-gray-400 text-xs">
                      {new Date(recMovie.release_date).getFullYear()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
