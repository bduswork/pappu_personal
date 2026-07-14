/**
 * Newsletter subscribers — captured from the public "Sign up" form and shown in
 * the admin Subscribers inbox. Stored in the `settings` table under key
 * "subscribers" as JSON (an array). (Client-safe: no Prisma here.)
 */

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string; // ISO
};

export type SubscribersData = { subscribers: Subscriber[] };

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Merge stored value over defaults so the shape always stays valid. */
export function withSubscribersDefaults(value: unknown): SubscribersData {
  const v = (value ?? {}) as Partial<SubscribersData>;
  const arr = Array.isArray(v.subscribers) ? v.subscribers : [];
  const subscribers = arr
    .map((s, i): Subscriber => ({
      id: typeof s?.id === "string" ? s.id : `sub-${i}`,
      email: typeof s?.email === "string" ? s.email : "",
      createdAt: typeof s?.createdAt === "string" ? s.createdAt : "",
    }))
    .filter((s) => s.email);
  return { subscribers };
}
