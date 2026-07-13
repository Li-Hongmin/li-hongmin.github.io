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

export const profile = generatedProfile;
export type Profile = typeof profile;