import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Play } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-16">
      <div className="container px-4 py-20 flex flex-col lg:flex-row gap-8 items-start">
        <div className="relative w-full max-w-[300px] mx-auto lg:mx-0">
          <Image
            src="/placeholder.svg"
            alt="Princess Yako"
            width={300}
            height={450}
            className="rounded-lg object-cover"
            priority
          />
          <button className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70">
            <Heart className="h-5 w-5 text-white" />
          </button>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              Adventure
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-2">
              Princess Yako
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Badge variant="secondary">8.4</Badge>
              </span>
              <span>1989</span>
              <span>2h 14m</span>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl">
            On a journey to find the cure for a Tatarigami's curse, Ashitaka
            finds himself in the middle of a war between the forest gods and
            Tatara, a mining colony. In this quest he also meets San, the
            Mononoke Hime.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-red-600 hover:bg-red-700">
              <Play className="mr-2 h-4 w-4" /> Watch Now
            </Button>
            <Button variant="outline">More Details</Button>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <span className="text-gray-400">Starring:</span>
            <span className="text-white">Arline Kelley</span>
            <span className="text-white">Julius Barrett</span>
            <span className="text-white">Anthony Lindsey</span>
          </div>
        </div>
      </div>
    </section>
  );
}
