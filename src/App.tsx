import { useCallback, useState } from "react";
import Contact from "./components/Contact";
import GlassAppShell from "./components/GlassAppShell";
import Hero from "./components/Hero";
import HeroBackdrop from "./components/HeroBackdrop";
import Publications from "./components/Publications";
import Recognition from "./components/Recognition";
import ResearchAreas from "./components/ResearchAreas";
import ResearchVision from "./components/ResearchVision";
import SelectedWork from "./components/SelectedWork";
import { profile } from "./data/profile";

export default function App() {
  const [heroCopyLifted, setHeroCopyLifted] = useState(false);
  const liftHeroCopy = useCallback(() => setHeroCopyLifted(true), []);

  return (
    <GlassAppShell
      backdrop={<HeroBackdrop onVideoEnded={liftHeroCopy} />}
      hero={<Hero profile={profile} copyLifted={heroCopyLifted} />}
    >
      <ResearchVision vision={profile.vision} affiliation={profile.affiliation} />
      <ResearchAreas areas={profile.researchAreas} />
      <SelectedWork work={profile.selectedWork} />
      <Publications publications={profile.publications} />
      <Recognition profile={profile} />
      <Contact profile={profile} />
    </GlassAppShell>
  );
}
