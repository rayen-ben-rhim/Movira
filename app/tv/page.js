import { TVShowsList } from "@/components/TVShowsList";
import NavBar from "@/components/NavBar";

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <div className="pt-16 pb-8 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              <span className="text-white">Discover TV Shows</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our vast collection of popular TV shows, from the latest
              blockbusters to timeless classics.
              <span className="text-purple-400 font-medium">
                Find your next favorite TV show
              </span>{" "}
              today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">5,000+</div>
                <div className="text-gray-400 text-sm">Popular TV Shows</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">Family</div>
                <div className="text-gray-400 text-sm">Friendly Content</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">HD</div>
                <div className="text-gray-400 text-sm">Quality Posters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  Real-time
                </div>
                <div className="text-gray-400 text-sm">Updated Data</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TVShowsList />
    </div>
  );
}

export const metadata = {
  title: "TV Shows - Movira | Discover Popular TV Shows",
  description:
    "Explore thousands of popular TV shows with Movira. Browse family-friendly TV shows, blockbusters, and classics with detailed information and ratings.",
};
