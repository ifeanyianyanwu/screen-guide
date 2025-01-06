export const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const cardVariants = {
  hidden: {
    y: 30,
    opacity: 0,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 1,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

export const imageVariants = {
  initial: {
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1.0],
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1.0],
    },
  },
};

export const badgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export const progressBarVariants = {
  animate: (isAnimating: boolean) => ({
    opacity: isAnimating ? 0.5 : 1,
    transition: { duration: 0.2 },
  }),
};
