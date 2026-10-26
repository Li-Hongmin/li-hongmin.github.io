import generatedProfile from "../generated/profile.json";

export type ExternalLink = { label: string; href: string };
export type Publication = {
  id: string;
  date: string;
  title: string;
  venue: string;
  links: ExternalLink[];
  featured: boolean;
};
export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  organization?: string;
  detail?: string;
  links?: ExternalLink[];
};

export type AiMathematicsItem = {
  id: string;
  date: string;
  title: string;
  board: string;
  paperId: string;
  version: string;
  qualifier?: string;
  links: ExternalLink[];
};
export type AiMathematics = { summary: string; disclosure: string; profileHref: string; items: AiMathematicsItem[] };

export const profile = generatedProfile;
export type Profile = typeof profile;