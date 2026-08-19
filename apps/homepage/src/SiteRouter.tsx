import App from "./App";
import { findResearchNote } from "./content/notes";
import AlphaSciencePage from "./pages/AlphaSciencePage";
import NotePage from "./pages/NotePage";
import NotesIndexPage from "./pages/NotesIndexPage";
import ProjectsIndexPage from "./pages/ProjectsIndexPage";

function normalizedPathname() {
  const path = window.location.pathname.replace(/index\.html$/, "");
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export default function SiteRouter() {
  const path = normalizedPathname();

  if (path === "/projects") return <ProjectsIndexPage />;
  if (path === "/projects/alphascience") return <AlphaSciencePage />;
  if (path === "/notes") return <NotesIndexPage />;

  const match = path.match(/^\/notes\/([^/]+)$/);
  if (match) {
    const note = findResearchNote(match[1]);
    if (note) return <NotePage note={note} />;
  }

  return <App />;
}
