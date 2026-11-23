import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// GSAP is only needed once someone navigates, so it is loaded on demand
// (and prefetched when the browser is idle, see app/template.tsx) instead of
// being part of every page's initial JavaScript.
const loadGsap = () => import("gsap").then((mod) => mod.gsap);

export const preloadPageAnimations = () => {
  void loadGsap();
};

const getBanners = () => {
  const banners = [1, 2, 3, 4].map((n) =>
    document.getElementById(`banner-${n}`)
  );
  return banners.every(Boolean) ? (banners as HTMLElement[]) : null;
};

// Replays the page-in reveal. The first reveal on each page load is pure CSS
// (`.page-banner` in globals.css); this is only used when the template is not
// remounted (the `?reset=` flow).
export const animatePageIn = async () => {
  const banners = getBanners();
  if (!banners) return;

  const gsap = await loadGsap();
  gsap
    .timeline()
    .set(banners, { yPercent: 0 })
    .to(banners, { yPercent: 100, stagger: 0.2 });
};

export const animatePageOut = async (
  href: string,
  router: AppRouterInstance
) => {
  const banners = getBanners();
  if (!banners) {
    // Never block navigation if the banners aren't on the page.
    router.push(href);
    return;
  }

  try {
    const gsap = await loadGsap();
    gsap
      .timeline()
      .set(banners, { yPercent: -100 })
      .to(banners, {
        yPercent: 0,
        stagger: 0.2,
        onComplete: () => router.push(href),
      });
  } catch {
    router.push(href);
  }
};
