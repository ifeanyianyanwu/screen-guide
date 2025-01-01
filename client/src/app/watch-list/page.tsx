import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  id: string;
  title: string;
  rating: number;
  year: string;
  duration: string;
  thumbnail: string;
  type?: "media" | "profile";
  subtitle?: string;
}

const items: MediaItem[] = [
  {
    id: "1",
    title: "Believe",
    rating: 7.2,
    year: "2021",
    duration: "55m",
    thumbnail: "/placeholder.svg",
    type: "media",
  },
  {
    id: "2",
    title: "Princess Yako",
    rating: 8.4,
    year: "1997",
    duration: "2h 14m",
    thumbnail: "/placeholder.svg",
    type: "media",
  },
];

export default async function WatchList() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4 pt-36">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
        >
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-white truncate">
              {item.title}
            </h3>
            {item.type === "media" ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{item.rating}</span>
                <span>•</span>
                <span>{item.year}</span>
                <span>•</span>
                <span>{item.duration}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">{item.subtitle}</p>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0 text-gray-400 hover:text-white"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
