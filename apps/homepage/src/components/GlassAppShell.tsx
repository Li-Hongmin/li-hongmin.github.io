import { type ReactNode, type UIEvent, useRef } from "react";
import { getLaunchProgress } from "../lib/scrollProgress";

type GlassAppShellProps = {
  backdrop: ReactNode;
  hero: ReactNode;
  navigation?: ReactNode;
  children: ReactNode;
};

export default function GlassAppShell({ backdrop, hero, navigation, children }: GlassAppShellProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const updateBackdropShade = (event: UIEvent<HTMLElement>) => {
    const scroller = event.currentTarget;
    const progress = getLaunchProgress(scroller.scrollTop, scroller.clientHeight * 0.72);
    viewportRef.current?.style.setProperty("--content-progress", progress.toFixed(3));
  };

  return (
    <div className="app-viewport" data-testid="app-viewport" ref={viewportRef}>
      {backdrop}
      <div className="content-backdrop-shade" aria-hidden="true" />
      {navigation}
      <main
        className="app-scroller"
        aria-label="Hongmin Li research app"
        tabIndex={0}
        onScroll={updateBackdropShade}
      >
        {hero}
        <div className="editorial-feed">
          <div className="app-content">{children}</div>
        </div>
      </main>
    </div>
  );
}
