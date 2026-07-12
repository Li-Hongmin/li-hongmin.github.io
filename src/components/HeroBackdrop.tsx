import { useState } from "react";
import { useHeroMedia } from "../hooks/useHeroMedia";

export default function HeroBackdrop() {
  const { shouldLoadVideo } = useHeroMedia();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-poster" />
      <video
        className={`hero-video${videoFailed ? " hero-video--failed" : ""}`}
        src={shouldLoadVideo && !videoFailed ? "/media/hero.mp4" : undefined}
        poster="/media/hero-poster.webp"
        autoPlay
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        onError={() => setVideoFailed(true)}
      />
    </div>
  );
}
