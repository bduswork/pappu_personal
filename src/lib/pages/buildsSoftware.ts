/**
 * "Builds Software" page content — shape, defaults, and a defaults-merge used by
 * the API, the admin editor, and the public page. Stored in the `settings` table
 * under key "page:builds-software" as JSON. (Client-safe: no Prisma here.)
 */

export type CompanyCard = {
  id: string;
  title: string;
  description: string;
  badge: string;
  link: string;
  logo: string;
};

export type Group = {
  id: string;
  heading: string;
  cards: CompanyCard[];
};

export type BuildsSoftwareContent = {
  banner: { image: string; headline: string; intro: string };
  groups: Group[];
};

export const DEFAULT_BUILDS_SOFTWARE: BuildsSoftwareContent = {
  banner: {
    image: "",
    headline:
      "I architect software that powers utilities, telecom, hospitals and banks.",
    intro:
      "ABM Whaiduzzaman is a software architect and technology leader — CTO of Nexalinx and former CEO of Automation Services Ltd, PMP-certified — with 18+ years building large-scale billing, metering and enterprise systems across Asia, Africa and the USA.",
  },
  groups: [
    {
      id: "g1",
      heading: "Chief Technology Officer",
      cards: [
        {
          id: "c1",
          title: "Nexalinx",
          description:
            "SaaS platforms for healthcare and government — Hospital ERP and Government MIS on a micro-service architecture, HL7 & DICOM compliant. USA & Dhaka.",
          badge: "2022 – Present",
          link: "",
          logo: "",
        },
      ],
    },
    {
      id: "g2",
      heading: "Chief Executive Officer",
      cards: [
        {
          id: "c2",
          title: "Automation Services Ltd",
          description:
            "Utility & telecom product company — AMI/MDM, Field Data Management, telecom billing and hospital management solutions delivered across multiple countries.",
          badge: "2020 – 2022",
          link: "",
          logo: "",
        },
      ],
    },
    {
      id: "g3",
      heading: "System Consultant",
      cards: [
        {
          id: "c3",
          title: "Ideal Electrical Enterprise",
          description:
            "Smart-metering & prepayment for national utilities (DPDC, DESCO, BREB, NESCO) — HES/AMI, MDM and agent management.",
          badge: "2014 – Present",
          link: "",
          logo: "",
        },
        {
          id: "c4",
          title: "Jiangsu Linyang Energy (China)",
          description:
            "STS/CTS vending solutions for Uganda UMEME and CTS for Bangladesh utilities; HES integration.",
          badge: "2018 – 2020",
          link: "",
          logo: "",
        },
        {
          id: "c5",
          title: "Shenzhen Inhemeter (China)",
          description: "AMI and Meter Data Management systems; led the development team.",
          badge: "2017 – 2018",
          link: "",
          logo: "",
        },
      ],
    },
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceCard(v: Partial<CompanyCard>, i: number): CompanyCard {
  return {
    id: str(v.id) || `c-${i}`,
    title: str(v.title),
    description: str(v.description),
    badge: str(v.badge),
    link: str(v.link),
    logo: str(v.logo),
  };
}

function coerceGroup(v: Partial<Group>, i: number): Group {
  return {
    id: str(v.id) || `g-${i}`,
    heading: str(v.heading),
    cards: Array.isArray(v.cards) ? v.cards.map(coerceCard) : [],
  };
}

/** Deep-merge stored content over defaults so missing keys stay valid. */
export function withBuildsDefaults(value: unknown): BuildsSoftwareContent {
  const v = (value ?? {}) as Partial<BuildsSoftwareContent>;
  return {
    banner: { ...DEFAULT_BUILDS_SOFTWARE.banner, ...(v.banner ?? {}) },
    groups: Array.isArray(v.groups)
      ? v.groups.map(coerceGroup)
      : DEFAULT_BUILDS_SOFTWARE.groups,
  };
}
