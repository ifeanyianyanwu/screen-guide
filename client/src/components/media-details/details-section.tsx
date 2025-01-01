import { Play } from "lucide-react";
import Image from "next/image";

export function DetailsSection() {
  return (
    <section className="bg-black/50 py-16">
      <div className="container px-4">
        <h2 className="text-2xl font-bold text-white mb-6">
          Fill seed first own life.
        </h2>
        <p className="text-gray-300 mb-8 max-w-3xl">
          Face can't fix that be cattle the man won't blessed. Cattle which
          wherein cattle created Under own them years very gathered. Face can't
          fix that be cattle the man won't blessed. Cattle which wherein cattle
          created Under own them years very gathered.
        </p>
        <div className="relative aspect-video max-w-3xl rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt="Trailer thumbnail"
            fill
            className="object-cover"
          />
          <button className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors">
            <div className="flex items-center gap-2 text-white">
              <Play className="h-12 w-12" />
              <span className="text-lg font-medium">Trailer</span>
            </div>
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-3xl text-gray-300">
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span>Production year</span>
              <span className="text-white">2020</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span>Country</span>
              <span className="text-white">USA</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span>Genre</span>
              <span className="text-white">Thriller Adventure</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span>Duration</span>
              <span className="text-white">2h 14m</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
