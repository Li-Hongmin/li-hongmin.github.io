import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function shouldLoadHeroVideo(width: number, reducedMotion: boolean) {
  return width >= 900 && !reducedMotion;
}

function readPolicy() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return shouldLoadHeroVideo(window.innerWidth, window.matchMedia(REDUCED_MOTION_QUERY).matches);
}

export function useHeroMedia() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(readPolicy);

  useEffect(() => {
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setShouldLoadVideo(readPolicy());
    window.addEventListener("resize", update, { passive: true });
    motionQuery.addEventListener("change", update);
    update();
    return () => {
      window.removeEventListener("resize", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return { shouldLoadVideo };
}
