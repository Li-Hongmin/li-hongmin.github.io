import { type ReactNode, type UIEvent, useEffect, useRef } from "react";
import { getLaunchProgress } from "../lib/scrollProgress";
import AppToolbar from "./AppToolbar";

type GlassAppShellProps = {
  backdrop: ReactNode;
  hero: ReactNode;
  children: ReactNode;
};

export default function GlassAppShell({ backdrop, hero, children }: GlassAppShellProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const { scrollTop, clientHeight } = event.currentTarget;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      viewportRef.current?.style.setProperty(
        "--launch-progress",
        getLaunchProgress(scrollTop, clientHeight).toFixed(4),
      );
      frameRef.current = null;
    });
  };

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="app-viewport" data-testid="app-viewport" ref={viewportRef}>
      {backdrop}
      <main
        className="app-scroller"
        aria-label="Hongmin Li research app"
        onScroll={handleScroll}
        tabIndex={0}
      >
        {hero}
        <div className="glass-app-surface">
          <div className="glass-grabber" aria-hidden="true" />
          <AppToolbar />
          <div className="app-content">{children}</div>
        </div>
      </main>
    </div>
  );
}
