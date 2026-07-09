/**
 * "My Story" page content — a timeline (image · year · text) plus a rich-text
 * story. Stored in the `settings` table under key "page:my-story" as JSON.
 * (Client-safe: no Prisma here.)
 */

export type Milestone = {
  id: string;
  image: string;
  year: string;
  text: string;
};

export type MyStoryContent = {
  timeline: Milestone[];
  story: string; // rich-text HTML
};

export const DEFAULT_MY_STORY: MyStoryContent = {
  timeline: [
    {
      id: "m1",
      image: "",
      year: "2007",
      text: "Graduated in Computer Science & Engineering from East West University and began his career as a programmer.",
    },
    {
      id: "m2",
      image: "",
      year: "2016",
      text: "Completed his MS at Jahangirnagar University — thesis on a Unified Electricity Pre-payment System — while leading telecom billing teams at IBCS-PRIMAX.",
    },
    {
      id: "m3",
      image: "",
      year: "2018",
      text: "Designed metering & STS/CTS vending solutions across China and Bangladesh, including prepayment systems for Uganda's UMEME utility.",
    },
    {
      id: "m4",
      image: "",
      year: "2020",
      text: "Became CEO of Automation Services Ltd, delivering AMI/MDM, telecom billing and hospital management solutions internationally.",
    },
    {
      id: "m5",
      image: "",
      year: "2022",
      text: "Joined Nexalinx as CTO, architecting Hospital ERP and Government MIS on a micro-service, HL7/DICOM-compliant SaaS platform across the USA and Bangladesh.",
    },
  ],
  story: `<h2>ABM Whaiduzzaman's Story</h2>
<p>ABM Whaiduzzaman is a software architect and technology leader based in Dhaka, Bangladesh. Over more than 18 years he has grown from a programmer into a CTO and CEO, designing large-scale systems for utilities, telecom, healthcare and banking across Bangladesh, China, the USA and Africa.</p>
<p>He began his career in 2007 as a programmer, and at IBCS-PRIMAX rose to System Analyst and Manager — building telecom billing (ICX/IGW) and roaming systems for operators such as GrameenPhone. In 2016 he completed his MS at Jahangirnagar University with a thesis on a Unified Electricity Pre-payment System.</p>
<p>He went on to lead metering and prepayment platforms at Shenzhen Inhemeter and Jiangsu Linyang in China — including STS/CTS vending for Uganda's UMEME. As CEO of Automation Services Ltd he delivered AMI/MDM, telecom billing and hospital management solutions internationally, and since 2022 he serves as CTO of Nexalinx, architecting Hospital ERP and Government MIS on a micro-service, HL7/DICOM-compliant SaaS platform.</p>
<p>He is PMP-certified, a member of BASIS and the Bangladesh Computer Society, and passionate about problem-solving, generating new ideas, and training the next generation of entrepreneurs through One-Focus.</p>`,
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceMilestone(v: Partial<Milestone>, i: number): Milestone {
  return {
    id: str(v.id) || `m-${i}`,
    image: str(v.image),
    year: str(v.year),
    text: str(v.text),
  };
}

/** Deep-merge stored content over defaults so missing keys stay valid. */
export function withMyStoryDefaults(value: unknown): MyStoryContent {
  const v = (value ?? {}) as Partial<MyStoryContent>;
  return {
    timeline: Array.isArray(v.timeline)
      ? v.timeline.map(coerceMilestone)
      : DEFAULT_MY_STORY.timeline,
    story: typeof v.story === "string" ? v.story : DEFAULT_MY_STORY.story,
  };
}
