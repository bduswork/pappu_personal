/**
 * "Nexalinx · ASL" page content — a banner plus a card per company. Stored in
 * the `settings` table under key "page:nexalinx-asl" as JSON.
 * (Client-safe: no Prisma here.)
 */

export type Company = {
  id: string;
  logo: string;
  name: string;
  role: string;
  period: string;
  location: string;
  website: string;
  description: string;
  highlights: string[];
};

export type NexalinxAslContent = {
  banner: { image: string; headline: string; intro: string };
  companies: Company[];
};

export const DEFAULT_NEXALINX_ASL: NexalinxAslContent = {
  banner: {
    image: "",
    headline: "The companies I lead.",
    intro:
      "Two companies, one mission — building enterprise-grade software for utilities, telecom, healthcare and government across Bangladesh, the USA and beyond. From advanced metering and billing platforms to hospital and government systems, this is where strategy meets engineering at scale.",
  },
  companies: [
    {
      id: "c1",
      logo: "",
      name: "Nexalinx",
      role: "Chief Technology Officer",
      period: "2022 – Present",
      location: "Long Island City, NY · Gulshan, Dhaka",
      website: "",
      description:
        "As Chief Technology Officer, ABM Whaiduzzaman leads Nexalinx's engineering across the USA and Bangladesh, turning healthcare and government workflows into dependable SaaS products. He architected a micro-service-based Hospital ERP and a Government MIS — both HL7- and DICOM-compliant — spanning patient management, diagnostics, pharmacy, billing, inventory and analytics. He built the platform for multi-tenancy, high availability and regulatory compliance, and directs cross-border product, DevOps and data teams delivering to hospitals and public-sector clients.",
      highlights: [
        "Micro-service Hospital ERP — HL7 & DICOM compliant",
        "Government MIS for public-sector operations",
        "Multi-tenant, high-availability SaaS architecture",
        "Leads product, DevOps & data teams across USA and Dhaka",
      ],
    },
    {
      id: "c2",
      logo: "",
      name: "Automation Services Ltd (ASL)",
      role: "Chief Executive Officer",
      period: "2020 – 2022",
      location: "South Badda, Dhaka",
      website: "",
      description:
        "As Chief Executive Officer of Automation Services Ltd, ABM Whaiduzzaman ran a utility and telecom product company delivering large-scale metering and billing systems across Asia and Africa. Under his leadership ASL shipped AMI/MDM (Advanced Metering Infrastructure & Meter Data Management), Field Data Management, STS/CTS prepayment vending, telecom billing and hospital management solutions to national utilities and operators — combining product strategy, engineering delivery and full P&L ownership across multiple countries.",
      highlights: [
        "AMI / MDM for national utilities",
        "STS / CTS prepayment vending & Field Data Management",
        "Telecom billing and hospital management solutions",
        "Product strategy, delivery & P&L across multiple countries",
      ],
    },
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceCompany(v: Partial<Company>, i: number): Company {
  return {
    id: str(v.id) || `c-${i}`,
    logo: str(v.logo),
    name: str(v.name),
    role: str(v.role),
    period: str(v.period),
    location: str(v.location),
    website: str(v.website),
    description: str(v.description),
    highlights: Array.isArray(v.highlights)
      ? v.highlights.map((h) => str(h)).filter(Boolean)
      : [],
  };
}

/** Deep-merge stored content over defaults so missing keys stay valid. */
export function withNexalinxAslDefaults(value: unknown): NexalinxAslContent {
  const v = (value ?? {}) as Partial<NexalinxAslContent>;
  return {
    banner: { ...DEFAULT_NEXALINX_ASL.banner, ...(v.banner ?? {}) },
    companies: Array.isArray(v.companies)
      ? v.companies.map(coerceCompany)
      : DEFAULT_NEXALINX_ASL.companies,
  };
}
