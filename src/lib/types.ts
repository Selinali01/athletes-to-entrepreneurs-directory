export interface Experience {
  position: string | null;
  companyName: string | null;
  location: string | null;
  employmentType: string | null;
  startText: string | null;
  endText: string | null;
  description: string | null;
}

export interface Education {
  schoolName: string | null;
  degree: string | null;
  fieldOfStudy: string | null;
  period: string | null;
}

export interface GuestProfile {
  url: string | null;
  firstName: string | null;
  lastName: string | null;
  photo: string | null;
  headline: string | null;
  about: string | null;
  location: string | null;
  currentTitle: string | null;
  currentCompany: string | null;
  followerCount: number | null;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: { title: string | null; issuedBy: string | null; issuedAt: string | null }[];
  languages: { name: string | null; proficiency: string | null }[];
  scrapedAt: string | null;
}

export interface Guest {
  id: string;
  name: string;
  episodeTitle: string;
  episodeUrl: string | null;
  linkedinUrl: string | null;
  publishedDate: string;
  hasProfile: boolean;
  profile: GuestProfile | null;
}
