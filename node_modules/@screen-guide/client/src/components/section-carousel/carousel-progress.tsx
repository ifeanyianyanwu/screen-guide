import { CarouselNext, CarouselPrevious } from "../ui/carousel";
import { cardVariants, progressBarVariants } from "./animations/variants";
import { motion } from "framer-motion";

export const CarouselProgress = ({
  current,
  count,
  isAnimating,
  progress,
  handleNext,
  handlePrev,
}: {
  current: number;
  count: number;
  isAnimating: boolean;
  progress: number;
  handleNext: () => void;
  handlePrev: () => void;
}) => (
  <motion.div
    className="flex justify-between items-center mt-8"
    variants={cardVariants}
    custom={2}
  >
    <div className="flex items-center space-x-1 text-sm bg-[#FFFFFF14] rounded-md p-2">
      <span className="font-medium">{current.toString().padStart(2, "0")}</span>
      <span className="text-[#FFFFFF66]">/</span>
      <span className="text-[#FFFFFF66]">
        {count.toString().padStart(2, "0")}
      </span>
    </div>
    <div className="flex-1 mx-4">
      <div className="h-[3px] bg-[#FFFFFF14] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${progress}%`,
            opacity: isAnimating ? 0.5 : 1,
          }}
          variants={progressBarVariants}
          custom={isAnimating}
        />
      </div>
    </div>
    <div className="flex space-x-2 relative">
      <CarouselPrevious
        onClick={handlePrev}
        className="relative left-0 top-4 h-8 w-8 bg-[#FFFFFF14] hover:bg-[#FFFFFF29] border-0 text-white rounded-lg"
        disabled={isAnimating}
      />
      <CarouselNext
        onClick={handleNext}
        className="relative top-4 right-0 h-8 w-8 bg-[#FFFFFF14] hover:bg-[#FFFFFF29] border-0 text-white rounded-lg"
        disabled={isAnimating}
      />
    </div>
  </motion.div>
);
