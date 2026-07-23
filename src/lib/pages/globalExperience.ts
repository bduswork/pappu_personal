/**
 * "Global Experience" page content — a CV-style view split into two tracks:
 * Job Experience and Consultancy Experience. Stored under key
 * "page:global-experience". (Client-safe: no Prisma here.)
 */

export type ExperienceItem = {
  id: string;
  image: string; // company logo / photo (optional)
  role: string; // position / title
  organization: string; // company or client
  location: string; // city, country
  period: string; // e.g. "2022 — Present"
  description: string; // short summary of the role
  highlights: string; // one achievement per line
};

export type ExperienceTrack = {
  heading: string;
  intro: string;
  items: ExperienceItem[];
};

export type GlobalExperienceContent = {
  banner: { image: string; headline: string; intro: string };
  jobs: ExperienceTrack;
  consultancy: ExperienceTrack;
};

export const DEFAULT_GLOBAL_EXPERIENCE: GlobalExperienceContent = {
  banner: {
    image: "",
    headline: "Global Experience",
    intro:
      "Work delivered beyond Bangladesh — across the USA, China and Uganda: enterprise SaaS for healthcare and government, advanced metering, and prepayment platforms rolled out at national scale.",
  },
  jobs: {
    heading: "Job Experience",
    intro: "Leadership roles based abroad or serving clients across multiple countries.",
    items: [
      {
        id: "j1",
        image: "",
        role: "Chief Technical Officer (CTO)",
        organization: "Nexalinx",
        location: "Long Island City, NY, USA · Gulshan, Dhaka",
        period: "July 2022 — Present",
        description:
          "Leads architecture and engineering across the USA and Bangladesh, delivering healthcare and government platforms as SaaS.",
        highlights:
          "Designed the SaaS architecture for Hospital ERP and Government MIS\nMicro-service and service-oriented architecture — service registry, discovery, monitoring and service mesh\nHospital Management Solutions compliant with HL7 and DICOM standards\nSystem architecture for water billing solutions\nManaged a USA-based client for Banking Process Automation\nManaged outsourcing clients and team delivery",
      },
      {
        id: "j2",
        image: "",
        role: "Chief Executive Officer (CEO)",
        organization: "Automation Services Ltd.",
        location: "Dhaka, Bangladesh · clients across multiple countries",
        period: "Feb 2020 — July 2022",
        description:
          "Led a utility and telecom product company serving clients in multiple countries.",
        highlights:
          "Managed utility clients across different countries\nPresented utility and telecom products in different countries\nPromoted Session Border Controller (SBC) solutions to telecom ICX companies\nManaged a USA client for Banking Process Automation\nArchitected FDM, HES/AMI, MDM, telecom billing and hospital management solutions\nProvided support to six ICX companies for ICX billing",
      },
      {
        id: "j3",
        image: "",
        role: "Sr. Software Manager",
        organization: "Shenzhen Inhemeter Co. Ltd.",
        location: "Nanshan District, Shenzhen, China",
        period: "Jan 2017 — June 2018",
        description:
          "Led a development team building AMI and meter data management products for utilities worldwide.",
        highlights:
          "Designed and developed an Advanced Metering Infrastructure (AMI) system\nDesigned the Meter Data Management (MDM) system architecture\nLed a development team to deliver project goals\nDefined protocols and standards for utility products\nPresented utility products in various countries\nImplemented Zabbix for system monitoring",
      },
    ],
  },
  consultancy: {
    heading: "Consultancy Experience",
    intro: "Consulting engagements delivered for clients outside Bangladesh.",
    items: [
      {
        id: "c1",
        image: "",
        role: "System Consultant",
        organization: "Jiangsu Linyang Energy Co., Ltd.",
        location: "Qidong, Jiangsu Province, China",
        period: "June 2018 — Feb 2020",
        description:
          "Designed prepayment vending and metering integration for utilities in Africa and Asia.",
        highlights:
          "Designed STS and CTS vending solutions for Uganda's UMEME utility\nDesigned and developed Field Data Management (FDM) solutions\nImplemented CTS solutions for the Bangladesh utility sector\nIntegrated HES (Head End System) with the CTS system\nIntegrated Linyang meters into the Unified System",
      },
      {
        id: "c2",
        image: "",
        role: "Consultant (Part-time)",
        organization: "Basumati IT Gen",
        location: "Dhaka, Bangladesh · delivering for a UK client",
        period: "March 2009 — Feb 2010",
        description:
          "Built a community platform for a client in the United Kingdom.",
        highlights:
          "Developed a community site (mysportskills.com) for the UK using PHP and CodeIgniter\nConducted requirement analysis for client software needs\nNormalized the logical data model and optimised database design\nDeveloped analytical SQL functions to derive insights",
      },
    ],
  },
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceItem(v: Partial<ExperienceItem>, i: number): ExperienceItem {
  return {
    id: str(v.id) || `e-${i}`,
    image: str(v.image),
    role: str(v.role),
    organization: str(v.organization),
    location: str(v.location),
    period: str(v.period),
    description: str(v.description),
    highlights: str(v.highlights),
  };
}

function coerceTrack(
  v: Partial<ExperienceTrack> | undefined,
  fallback: ExperienceTrack
): ExperienceTrack {
  const t = v ?? {};
  return {
    heading: str(t.heading) || fallback.heading,
    intro: str(t.intro, fallback.intro),
    items: Array.isArray(t.items)
      ? t.items.map((it, i) => coerceItem(it, i))
      : fallback.items,
  };
}

export function withGlobalExperienceDefaults(value: unknown): GlobalExperienceContent {
  const v = (value ?? {}) as Partial<GlobalExperienceContent>;
  return {
    banner: { ...DEFAULT_GLOBAL_EXPERIENCE.banner, ...(v.banner ?? {}) },
    jobs: coerceTrack(v.jobs, DEFAULT_GLOBAL_EXPERIENCE.jobs),
    consultancy: coerceTrack(v.consultancy, DEFAULT_GLOBAL_EXPERIENCE.consultancy),
  };
}

/** Split the newline-separated highlights field into clean bullet lines. */
export function highlightLines(highlights: string): string[] {
  return highlights
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
