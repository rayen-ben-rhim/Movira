import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Orb from "@/components/OrbBg";
import { ModernInput } from "@/components/ModrenInput";
import { MoviesList } from "@/components/MoviesList";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Movira - Discover Amazing Movies | AI-Powered Movie Search",
  description:
    "Discover amazing movies with Movira's AI-powered search. Explore popular films, family-friendly content, and find your next favorite movie in seconds.",
};

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="w-full min-h-screen bg-black">
      <NavBar />

      <div className="w-full h-screen relative bg-black">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-4xl px-5 text-center">
          <div className="mb-12 space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
              <span className="block  text-white">Discover Amazing Movies</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Explore millions of movies, TV shows, and documentaries.
              <span className="text-purple-400 font-medium">
                {" "}
                Find your next favorite
              </span>{" "}
              in seconds.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl rounded-full"></div>
            <div className="relative">
              <ModernInput />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-gray-400 text-sm">
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs font-mono">
                Enter
              </kbd>
              <span className="ml-2">
                to search or scroll down to explore trending movies
              </span>
            </p>
          </div>
        </div>
      </div>

      <MoviesList />
    </div>
  );
}
