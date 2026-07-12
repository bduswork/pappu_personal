"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CONTACT_LINK,
  SOCIAL_LINKS,
  type NavLink as NavLinkType,
  type NavSection,
  type TrainingGroup,
} from "@/lib/navigation";
import SocialIcon from "./SocialIcon";
import BrandSignature from "./BrandSignature";
import ProgramMiniBadge from "./ProgramMiniBadge";

const MotionLink = motion.create(Link);

/** Is the given href the active route (exact or nested)? */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * A submenu link with a left-to-right green wipe on hover (white text on the
 * blue sidebar; the label flips to white over the green fill).
 */
function NavItem({
  link,
  accent,
  active,
  onNavigate,
  prominent = false,
  trailing,
}: {
  link: NavLinkType;
  accent: NavSection["accent"];
  active: boolean;
  onNavigate?: () => void;
  /** Larger text (like a heading) — used for the standalone Contact link. */
  prominent?: boolean;
  /** Optional right-aligned element (e.g. a program status badge). */
  trailing?: React.ReactNode;
}) {
  const solid = accent === "green" ? "bg-brand-green" : "bg-brand-blue";

  return (
    <MotionLink
      href={link.href}
      onClick={onNavigate}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className={`group relative flex items-center gap-2 overflow-hidden rounded-md px-3 py-1.5 font-bold uppercase tracking-wide ${
        prominent ? "text-sm" : "text-[13px]"
      }`}
    >
      {active && (
        <span className={`absolute inset-0 ${solid} shadow-sm`} aria-hidden />
      )}
      {!active && (
        <motion.span
          aria-hidden
          className="absolute inset-0 origin-left bg-brand-green"
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <span
        className={`relative z-10 min-w-0 flex-1 transition-colors duration-300 ${
          active ? "text-white" : "text-white/85 group-hover:text-white"
        }`}
      >
        {link.label}
      </span>
      {trailing && <span className="relative z-10 shrink-0">{trailing}</span>}
    </MotionLink>
  );
}

const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg
    viewBox="0 0 24 24"
    className="ml-2 h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

/** Expandable "Programs and Master Classes" dropdown, listing active programs. */
function TrainingDropdown({
  group,
  onNavigate,
}: {
  group: TrainingGroup;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const hasActive = group.programs.some((p) => isActive(pathname, p.href));
  // Open by default on the home page (so the program + badge are visible) or
  // when a program is the active route — the user can still collapse it.
  const [open, setOpen] = useState(hasActive || pathname === "/");

  return (
    <div className="mt-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide text-white/85 transition-colors hover:bg-white/10 hover:text-white"
      >
        <span className="flex-1 text-left">{group.label}</span>
        <Chevron open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden pl-2.5"
          >
            {group.programs.map((p) => (
              <li key={p.href} className="mt-0.5">
                <NavItem
                  link={p}
                  accent="green"
                  active={isActive(pathname, p.href)}
                  onNavigate={onNavigate}
                  trailing={<ProgramMiniBadge startAt={p.startAt} endAt={p.endAt} />}
                />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A pillar: clickable header that expands/collapses its submenu (accordion). */
function PillarAccordion({
  section,
  onNavigate,
}: {
  section: NavSection;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const hrefs = [
    ...section.links.map((l) => l.href),
    ...(section.linksAfter?.map((l) => l.href) ?? []),
    ...(section.training?.programs.map((p) => p.href) ?? []),
  ];
  const containsActive = hrefs.some((h) => isActive(pathname, h));
  const [open, setOpen] = useState(containsActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
          open ? "bg-brand-green" : "hover:bg-white/10"
        }`}
      >
        <span>
          <span className="block text-sm font-bold uppercase tracking-wide text-white">
            {section.title}
          </span>
          <span
            className={`block text-[11px] uppercase tracking-[0.14em] ${
              open ? "text-white/80" : "text-white/55"
            }`}
          >
            {section.tagline}
          </span>
        </span>
        <span className="text-white">
          <Chevron open={open} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-1 flex flex-col gap-0.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <NavItem
                    link={link}
                    accent={section.accent}
                    active={isActive(pathname, link.href)}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>

            {section.training && (
              <TrainingDropdown group={section.training} onNavigate={onNavigate} />
            )}

            {section.linksAfter && (
              <ul className="mt-0.5 flex flex-col gap-0.5">
                {section.linksAfter.map((link) => (
                  <li key={link.href}>
                    <NavItem
                      link={link}
                      accent={section.accent}
                      active={isActive(pathname, link.href)}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Uploaded signature image, or the built-in hand-drawn mark as a fallback. */
function BrandMark({ signature, className }: { signature?: string; className: string }) {
  if (signature) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={signature} alt="ABM Whaiduzzaman" className={`${className} object-contain object-left`} />;
  }
  return <BrandSignature className={`${className} text-white`} />;
}

function SidebarBody({
  sections,
  signature,
  onNavigate,
}: {
  sections: NavSection[];
  signature?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-y-auto scroll-slim px-7 py-8 text-white">
      {/* Brand — uploaded signature/logo, else the built-in mark */}
      <Link href="/" onClick={onNavigate} className="block">
        <BrandMark signature={signature} className="h-12 w-auto" />
      </Link>

      {/* Pillars (accordion) */}
      <nav className="mt-8 flex flex-col gap-2">
        {sections.map((section) => (
          <PillarAccordion
            key={section.key}
            section={section}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Standalone Contact (global, like garyvaynerchuk.com) */}
      <div className="mt-4">
        <NavItem
          link={CONTACT_LINK}
          accent="green"
          active={pathname === CONTACT_LINK.href}
          onNavigate={onNavigate}
          prominent
        />
      </div>

      {/* Search */}
      <form
        action="/search"
        className="mt-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-white/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          name="q"
          placeholder="Search"
          className="w-full bg-transparent text-sm uppercase tracking-wide text-white placeholder:text-white/50 focus:outline-none"
        />
      </form>

      {/* Social */}
      <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-5 text-white/80">
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="transition-colors hover:text-brand-green"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon icon={s.icon} className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({
  sections,
  signature,
}: {
  sections: NavSection[];
  signature?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-sidebar px-5 py-3 lg:hidden">
        <Link href="/" aria-label="Home">
          <BrandMark signature={signature} className="h-7 w-auto" />
        </Link>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-1.5 text-white hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width)] max-w-[85vw] transform bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarBody
          sections={sections}
          signature={signature}
          onNavigate={() => setOpen(false)}
        />
      </aside>
    </>
  );
}
