"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import {
  Star,
  Calendar,
  Tv,
  Globe,
  ArrowLeft,
  Play,
  Users,
  Hash,
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

export default function TVShowDetailsPage() {
  const params = useParams();
  const showId = params.id;

  const [tvShow, setTVShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE_URL = process.env.BASE_URL;
  const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;
  const BACKDROP_BASE_URL =
    "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces";

  useEffect(() => {
    if (showId) {
      fetchTVShowDetails();
      checkIfFavorite();
    }
  }, [showId]);

  const checkIfFavorite = () => {
    try {
      const savedFavorites = localStorage.getItem("movira_favorites");
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        const isInFavorites = favorites.some(
          (item) => item.id === parseInt(showId) && item.type === "tv"
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
        (item) => item.id === parseInt(showId) && item.type === "tv"
      );

      if (existingIndex >= 0) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        setIsFavorite(false);
      } else {
        // Add to favorites
        const favoriteItem = {
          id: tvShow.id,
          type: "tv",
          name: tvShow.name,
          poster_path: tvShow.poster_path,
          first_air_date: tvShow.first_air_date,
          vote_average: tvShow.vote_average,
        };
        favorites.push(favoriteItem);
        setIsFavorite(true);
      }

      localStorage.setItem("movira_favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const fetchTVShowDetails = async () => {
    try {
      setLoading(true);

      // Fetch TV show details, cast, and recommendations in parallel
      const [showResponse, creditsResponse, recommendationsResponse] =
        await Promise.all([
          fetch(`${BASE_URL}/tv/${showId}?api_key=${API_KEY}&language=en-US`),
          fetch(
            `${BASE_URL}/tv/${showId}/credits?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `${BASE_URL}/tv/${showId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

      if (
        !showResponse.ok ||
        !creditsResponse.ok ||
        !recommendationsResponse.ok
      ) {
        throw new Error("Failed to fetch TV show details");
      }

      const [showData, creditsData, recommendationsData] = await Promise.all([
        showResponse.json(),
        creditsResponse.json(),
        recommendationsResponse.json(),
      ]);

      setTVShow(showData);
      setCast(creditsData.cast.slice(0, 12)); // Show top 12 cast members
      setRecommendations(recommendationsData.results.slice(0, 6)); // Show 6 recommendations
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching TV show details:", err);
    } finally {
      setLoading(false);
    }
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
            <span className="text-white text-lg">
              Loading TV show details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              TV Show Not Found
            </h2>
            <p className="text-gray-400 mb-6">
              {error || "The TV show you're looking for doesn't exist."}
            </p>
            <Link
              href="/tv"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Back to TV Shows
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
        {tvShow.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <img
              src={`${BACKDROP_BASE_URL}${tvShow.backdrop_path}`}
              alt={tvShow.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/tv"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to TV Shows</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                {tvShow.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${tvShow.poster_path}`}
                    alt={tvShow.name}
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
                  {tvShow.name}
                  {tvShow.first_air_date && (
                    <span className="text-gray-400 font-normal text-3xl ml-4">
                      ({new Date(tvShow.first_air_date).getFullYear()})
                    </span>
                  )}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {tvShow.vote_average > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">
                        {tvShow.vote_average.toFixed(1)}
                      </span>
                      <span className="text-gray-400">
                        ({tvShow.vote_count.toLocaleString()} votes)
                      </span>
                    </div>
                  )}

                  {tvShow.first_air_date && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>
                        First Aired: {formatDate(tvShow.first_air_date)}
                      </span>
                    </div>
                  )}

                  {tvShow.number_of_seasons && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Tv className="h-4 w-4" />
                      <span>
                        {tvShow.number_of_seasons} Season
                        {tvShow.number_of_seasons !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {tvShow.number_of_episodes && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Hash className="h-4 w-4" />
                      <span>{tvShow.number_of_episodes} Episodes</span>
                    </div>
                  )}

                  {tvShow.original_language && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Globe className="h-4 w-4" />
                      <span>{tvShow.original_language.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {tvShow.status && (
                  <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    {tvShow.status}
                  </span>
                )}
                {tvShow.type && (
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                    {tvShow.type}
                  </span>
                )}
              </div>

              {tvShow.genres && tvShow.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map((genre) => (
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

              {tvShow.overview && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Overview
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {tvShow.overview}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tvShow.episode_run_time &&
                  tvShow.episode_run_time.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        Episode Runtime
                      </h4>
                      <p className="text-gray-300">
                        ~{tvShow.episode_run_time[0]} minutes
                      </p>
                    </div>
                  )}

                {tvShow.last_air_date && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      Last Aired
                    </h4>
                    <p className="text-gray-300">
                      {formatDate(tvShow.last_air_date)}
                    </p>
                  </div>
                )}

                {tvShow.networks && tvShow.networks.length > 0 && (
                  <div className="sm:col-span-2">
                    <h4 className="text-white font-semibold mb-2">Networks</h4>
                    <p className="text-gray-300">
                      {tvShow.networks
                        .map((network) => network.name)
                        .join(", ")}
                    </p>
                  </div>
                )}

                {tvShow.production_companies &&
                  tvShow.production_companies.length > 0 && (
                    <div className="sm:col-span-2">
                      <h4 className="text-white font-semibold mb-2">
                        Production Companies
                      </h4>
                      <p className="text-gray-300">
                        {tvShow.production_companies
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
              {recommendations.map((recShow) => (
                <Link
                  key={recShow.id}
                  href={`/tv/${recShow.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-gray-800 hover:scale-105 transition-transform duration-300">
                    {recShow.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${recShow.poster_path}`}
                        alt={recShow.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-500" />
                      </div>
                    )}

                    {recShow.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-white text-xs">
                          {recShow.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors">
                    {recShow.name}
                  </h4>
                  {recShow.first_air_date && (
                    <p className="text-gray-400 text-xs">
                      {new Date(recShow.first_air_date).getFullYear()}
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
