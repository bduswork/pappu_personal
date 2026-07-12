/**
 * Programs & Master Classes — the shape used by the admin, the API, the public
 * program pages, and the sidebar dropdown. Stored in the `settings` table under
 * key "programs" as JSON (an array of programs). (Client-safe: no Prisma here.)
 */

export type ProgramModule = { id: string; title: string; description: string };
export type Snapshot = { id: string; url: string };

export type Program = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  hero: string; // image URL
  about: string; // rich-text HTML
  startAt: string; // ISO datetime, or ""
  endAt: string; // ISO datetime, or ""
  enrollLabel: string;
  modules: ProgramModule[];
  snapshots: Snapshot[];
  published: boolean;
};

export type ProgramsData = { programs: Program[] };

export type ProgramStatus = "UPCOMING" | "ONGOING" | "FINISHED" | "NONE";

/** Derive a program's status from its dates and the current time (ms). */
export function programStatus(
  p: { startAt: string; endAt: string },
  nowMs: number
): ProgramStatus {
  const start = p.startAt ? Date.parse(p.startAt) : NaN;
  const end = p.endAt ? Date.parse(p.endAt) : NaN;
  if (Number.isNaN(start) && Number.isNaN(end)) return "NONE";
  if (!Number.isNaN(start) && nowMs < start) return "UPCOMING";
  if (!Number.isNaN(end) && nowMs > end) return "FINISHED";
  return "ONGOING";
}

/** URL-safe slug from a program name (drops trademark markers). */
export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/™|\(\s*tm\s*\)/gi, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "program"
  );
}

/** Name with "(TM)" normalised to "™" for plain-text display (e.g. sidebar). */
export function plainBrand(name: string): string {
  return name.replace(/\(\s*tm\s*\)/gi, "™");
}

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: "p-force",
    slug: "force-progression",
    name: "FORCE Progression™",
    tagline: "trains entrepreneurs",
    hero: "",
    about:
      "<p>The FORCE Progression™ is a Life Operating System — not a motivational session. Over a focused journey it trains entrepreneurs and SME owners to build disciplined, high-output businesses.</p><p>Drawn from ABM Whaiduzzaman's two decades building and scaling technology companies.</p>",
    startAt: "",
    endAt: "",
    enrollLabel: "Enroll now",
    modules: [
      { id: "m-f", title: "F — Focus", description: "Give all your power to the one thing that truly matters." },
      { id: "m-o", title: "O — Ownership", description: "Take complete ownership of your life, decisions and results." },
      { id: "m-r", title: "R — Responsibility", description: "Build the habit of keeping every promise you make." },
      { id: "m-c", title: "C — Consistency", description: "Small daily habits compound into extraordinary results." },
      { id: "m-e", title: "E — Excellence", description: "Excellence isn't a task — it's an identity." },
    ],
    snapshots: [],
    published: true,
  },
];

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceModule(v: Partial<ProgramModule>, i: number): ProgramModule {
  return {
    id: str(v.id) || `m-${i}`,
    title: str(v.title),
    description: str(v.description),
  };
}

function coerceSnapshot(v: Partial<Snapshot>, i: number): Snapshot {
  return { id: str(v.id) || `s-${i}`, url: str(v.url) };
}

function coerceProgram(v: Partial<Program>, i: number): Program {
  const name = str(v.name);
  return {
    id: str(v.id) || `p-${i}`,
    slug: str(v.slug) || slugify(name) || `program-${i}`,
    name,
    tagline: str(v.tagline),
    hero: str(v.hero),
    about: str(v.about),
    startAt: str(v.startAt),
    endAt: str(v.endAt),
    enrollLabel: str(v.enrollLabel) || "Enroll now",
    modules: Array.isArray(v.modules) ? v.modules.map(coerceModule) : [],
    snapshots: Array.isArray(v.snapshots) ? v.snapshots.map(coerceSnapshot) : [],
    published: v.published !== false,
  };
}

/** Validate/normalise stored programs; missing array → the default seed. */
export function withProgramsDefaults(value: unknown): ProgramsData {
  const v = (value ?? {}) as Partial<ProgramsData>;
  const programs = Array.isArray(v.programs)
    ? v.programs.map(coerceProgram)
    : DEFAULT_PROGRAMS;
  return { programs };
}
