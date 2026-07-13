import { type ReactNode } from "react";

type GlassAppShellProps = {
  backdrop: ReactNode;
  hero: ReactNode;
  navigation?: ReactNode;
  children: ReactNode;
};

export default function GlassAppShell({ backdrop, hero, navigation, children }: GlassAppShellProps) {
  return (
    <div className="app-viewport" data-testid="app-viewport">
      {backdrop}
      {navigation}
      <main
        className="app-scroller"
        aria-label="Hongmin Li research app"
        tabIndex={0}
      >
        {hero}
        <div className="editorial-feed">
          <div className="app-content">{children}</div>
        </div>
      </main>
    </div>
  );
}
