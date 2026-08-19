import type { ReactNode } from "react";

type EditorialPageShellProps = {
  children: ReactNode;
};

const navigation = [
  ["Home", "/"],
  ["Projects", "/projects/"],
  ["Notes", "/notes/"],
] as const;

export default function EditorialPageShell({ children }: EditorialPageShellProps) {
  return (
    <div className="editorial-page">
      <header className="editorial-page__header">
        <a className="monogram" href="/" aria-label="Hongmin Li, home">H/L</a>
        <nav aria-label="Site navigation">
          <ul>
            {navigation.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
        </nav>
      </header>
      <main className="editorial-page__main">{children}</main>
      <footer className="editorial-page__footer">
        <p>Hongmin Li</p>
        <p>AI for Science · Research systems · Biomolecular design</p>
      </footer>
    </div>
  );
}
