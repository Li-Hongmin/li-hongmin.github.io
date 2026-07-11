import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Publications from "./components/Publications";
import Recognition from "./components/Recognition";
import ResearchAreas from "./components/ResearchAreas";
import ResearchVision from "./components/ResearchVision";
import SelectedWork from "./components/SelectedWork";
import { profile } from "./data/profile";

export default function App() {
  return (
    <main>
      <Hero profile={profile} />
      <div className="hero-transition" aria-hidden="true" />
      <ResearchVision vision={profile.vision} affiliation={profile.affiliation} />
      <ResearchAreas areas={profile.researchAreas} />
      <SelectedWork work={profile.selectedWork} />
      <Publications publications={profile.publications} />
      <Recognition profile={profile} />
      <Contact profile={profile} />
    </main>
  );
}
