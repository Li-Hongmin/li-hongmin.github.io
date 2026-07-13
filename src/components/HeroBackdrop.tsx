import { useEffect, useState } from "react";
import { useHeroMedia } from "../hooks/useHeroMedia";

type HeroBackdropProps = {
  onVideoSettled?: () => void;
};

export default function HeroBackdrop({ onVideoSettled }: HeroBackdropProps) {
  const { shouldLoadVideo } = useHeroMedia();
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!shouldLoadVideo || videoFailed) onVideoSettled?.();
  }, [onVideoSettled, shouldLoadVideo, videoFailed]);

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
        onEnded={onVideoSettled}
        onError={() => setVideoFailed(true)}
      />
    </div>
  );
}
