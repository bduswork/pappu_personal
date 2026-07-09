import Sidebar from "@/components/Sidebar";
import { getSettings } from "@/lib/getSettings";
import { getSidebarSections } from "@/lib/getNav";

export const dynamic = "force-dynamic";

/** Public site layout — fixed left sidebar + optional top banner + content. */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ topBanner }, sections] = await Promise.all([
    getSettings(),
    getSidebarSections(),
  ]);
  const text = topBanner.text.trim();
  const show = topBanner.enabled && !!text;

  const rawLink = topBanner.link.trim();
  const href = rawLink
    ? /^https?:\/\//.test(rawLink) || rawLink.startsWith("/")
      ? rawLink
      : `https://${rawLink}`
    : "";
  const external = /^https?:\/\//.test(href);

  return (
    <>
      <Sidebar sections={sections} />
      <main className="lg:pl-[var(--sidebar-width)]">
        <div className="pt-16 lg:pt-0">
          {show &&
            (href ? (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block bg-amber-400 px-4 py-2.5 text-center text-sm font-bold text-ink transition-colors hover:bg-amber-300"
              >
                <span className="underline underline-offset-2">{text}</span>
              </a>
            ) : (
              <div className="bg-amber-400 px-4 py-2.5 text-center text-sm font-bold text-ink">
                {text}
              </div>
            ))}
          {children}
        </div>
      </main>
    </>
  );
}
