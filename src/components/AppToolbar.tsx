const items = [
  ["Overview", "#about"],
  ["Research", "#research"],
  ["Papers", "#publications"],
  ["Contact", "#contact"],
] as const;

export default function AppToolbar() {
  return (
    <div className="app-toolbar-wrap">
      <nav className="app-toolbar" aria-label="App navigation">
        <a className="app-identity" href="#top" aria-label="Hongmin Li, launch screen">
          <span aria-hidden="true">H/L</span>
          <span>Scientific AI</span>
        </a>
        <ul>
          {items.map(([label, href]) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
