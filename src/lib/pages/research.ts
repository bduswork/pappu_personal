/**
 * "Research Paper" page content — publications with author list, venue, links
 * and a scholar profile. Stored under key "page:research".
 * (Client-safe: no Prisma here.)
 */

export type ResearchPaper = {
  id: string;
  title: string;
  authors: string; // "who" — comma-separated author list
  venue: string; // journal / conference
  year: string;
  summary: string; // short details / abstract
  link: string; // DOI or publisher URL
  image: string; // cover or thumbnail (optional)
};

export type ResearchContent = {
  banner: { image: string; headline: string; intro: string };
  /** Public scholar profile (e.g. Google Scholar). */
  profile: { label: string; link: string };
  papers: ResearchPaper[];
};

export const DEFAULT_RESEARCH: ResearchContent = {
  banner: {
    image: "",
    headline: "Research & Publications",
    intro:
      "Peer-reviewed work at the intersection of machine learning, metering intelligence and large-scale enterprise systems.",
  },
  profile: {
    label: "Google Scholar profile",
    link: "https://scholar.google.com/citations?user=3vXDiEoAAAAJ&hl=en",
  },
  papers: [
    {
      id: "r1",
      title:
        "Dimensionality Reduction-Enhanced Few-Shot Binary Classification of Electric Meters: An Empirical Analysis and Performance Evaluation",
      authors: "ABM Whaiduzzaman, A Al Ryan",
      venue:
        "International Conference on Computational Intelligence in Data Science (ICCIDS 2025), Springer — pp. 208–223",
      year: "2025",
      summary:
        "An empirical study on combining dimensionality reduction with few-shot learning to classify electric meters from limited labelled samples, with a performance evaluation across techniques.",
      link: "https://link.springer.com/chapter/10.1007/978-3-031-98364-1_17",
      image: "",
    },
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coercePaper(v: Partial<ResearchPaper>, i: number): ResearchPaper {
  return {
    id: str(v.id) || `r-${i}`,
    title: str(v.title),
    authors: str(v.authors),
    venue: str(v.venue),
    year: str(v.year),
    summary: str(v.summary),
    link: str(v.link),
    image: str(v.image),
  };
}

export function withResearchDefaults(value: unknown): ResearchContent {
  const v = (value ?? {}) as Partial<ResearchContent>;
  return {
    banner: { ...DEFAULT_RESEARCH.banner, ...(v.banner ?? {}) },
    profile: { ...DEFAULT_RESEARCH.profile, ...(v.profile ?? {}) },
    papers: Array.isArray(v.papers)
      ? v.papers.map((p, i) => coercePaper(p, i))
      : DEFAULT_RESEARCH.papers,
  };
}
