import { useCallback, useState } from "react";
import Contact from "./components/Contact";
import FeaturedPaper from "./components/FeaturedPaper";
import GlassAppShell from "./components/GlassAppShell";
import Hero, { HeroNavigation } from "./components/Hero";
import HeroBackdrop from "./components/HeroBackdrop";
import Publications from "./components/Publications";
import Recognition from "./components/Recognition";
import ResearchVision from "./components/ResearchVision";
import { profile } from "./data/profile";

export default function App() {
  const [heroCopyLifted, setHeroCopyLifted] = useState(false);
  const liftHeroCopy = useCallback(() => setHeroCopyLifted(true), []);

  return (
    <GlassAppShell
      backdrop={<HeroBackdrop onVideoEnded={liftHeroCopy} />}
      hero={<Hero profile={profile} copyLifted={heroCopyLifted} />}
      navigation={<HeroNavigation className="desktop-outline" />}
    >
      <ResearchVision vision={profile.vision} affiliation={profile.affiliation} />
      <FeaturedPaper publication={profile.publications[0]} />
      <Publications publications={profile.publications} />
      <Recognition profile={profile} />
      <Contact profile={profile} />
    </GlassAppShell>
  );
}
