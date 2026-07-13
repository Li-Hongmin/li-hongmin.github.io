import { useState } from "react";
import { useHeroMedia } from "../hooks/useHeroMedia";

type HeroBackdropProps = {
  onVideoEnded?: () => void;
};

export default function HeroBackdrop({ onVideoEnded }: HeroBackdropProps) {
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
        onEnded={onVideoEnded}
        onError={() => setVideoFailed(true)}
      />
    </div>
  );
}
