import { RefObject, useEffect, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible (0-1). */
  amount?: number;
  /** Root margin, e.g. "0px 0px -10% 0px". */
  margin?: string;
};

/**
 * Becomes true the first time the element scrolls into view, then stays true.
 * A few lines of IntersectionObserver instead of framer-motion's `useInView`,
 * so sections can trigger CSS transitions without shipping an animation library.
 */
export function useInViewOnce<T extends Element>(
  ref: RefObject<T>,
  { amount = 0, margin = "0px" }: Options = {}
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: margin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, amount, margin, inView]);

  return inView;
}
