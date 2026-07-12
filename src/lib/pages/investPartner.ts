/**
 * "Invest & Partner" page content — banner, pitch, partnership opportunities,
 * and a contact form (submissions land in Messages tagged "Partnership").
 * Stored under key "page:ventures-invest". (Client-safe: no Prisma here.)
 */

export type Opportunity = { id: string; title: string; description: string };

export type InvestContent = {
  banner: { image: string; headline: string };
  pitch: string; // rich-text HTML
  opportunities: Opportunity[];
  form: { heading: string; intro: string };
};

export const DEFAULT_INVEST: InvestContent = {
  banner: { image: "", headline: "Invest & Partner" },
  pitch:
    "<p>Partner with ABM Whaiduzzaman to build and scale ventures. With two decades architecting technology companies across utilities, telecom, healthcare and finance, I invest in and co-build brands with strong fundamentals and clear focus.</p>",
  opportunities: [
    { id: "o1", title: "Co-found & build", description: "Hands-on partnership to build a product or brand from zero." },
    { id: "o2", title: "Invest & advise", description: "Capital plus strategic and technical guidance for growth-stage teams." },
  ],
  form: {
    heading: "Let's talk",
    intro: "Tell me about your venture or partnership idea and I'll get back to you.",
  },
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceOpp(v: Partial<Opportunity>, i: number): Opportunity {
  return { id: str(v.id) || `o-${i}`, title: str(v.title), description: str(v.description) };
}

export function withInvestDefaults(value: unknown): InvestContent {
  const v = (value ?? {}) as Partial<InvestContent>;
  return {
    banner: { ...DEFAULT_INVEST.banner, ...(v.banner ?? {}) },
    pitch: typeof v.pitch === "string" ? v.pitch : DEFAULT_INVEST.pitch,
    opportunities: Array.isArray(v.opportunities)
      ? v.opportunities.map(coerceOpp)
      : DEFAULT_INVEST.opportunities,
    form: { ...DEFAULT_INVEST.form, ...(v.form ?? {}) },
  };
}
