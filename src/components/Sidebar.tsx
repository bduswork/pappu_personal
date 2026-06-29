"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BRAND,
  NAV_SECTIONS,
  SOCIAL_LINKS,
  type NavLink as NavLinkType,
  type NavSection,
} from "@/lib/navigation";
import SocialIcon from "./SocialIcon";

const MotionLink = motion.create(Link);

/**
 * A single submenu link with a left-to-right green wipe on hover.
 * The green fill is an absolutely-positioned layer whose scaleX animates
 * 0 -> 1 from its left edge; the label sits above it and flips to white.
 */
function NavItem({
  link,
  accent,
  active,
  onNavigate,
}: {
  link: NavLinkType;
  accent: NavSection["accent"];
  active: boolean;
  onNavigate?: () => void;
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
      className="group relative block overflow-hidden rounded-md px-3 py-1.5 text-[13px] font-medium uppercase tracking-wide"
    >
      {/* Active state: solid accent fill that's always visible */}
      {active && (
        <span className={`absolute inset-0 ${solid} shadow-sm`} aria-hidden />
      )}

      {/* Hover wipe: green, left-to-right (skipped when already active) */}
      {!active && (
        <motion.span
          aria-hidden
          className="absolute inset-0 origin-left bg-brand-green"
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      <span
        className={`relative z-10 transition-colors duration-300 ${
          active ? "text-white" : "text-ink-soft group-hover:text-white"
        }`}
      >
        {link.label}
      </span>
    </MotionLink>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto scroll-slim px-7 py-8">
      {/* Brand */}
      <Link
        href="/"
        onClick={onNavigate}
        className="block"
      >
        <h1 className="text-xl font-extrabold tracking-tight text-ink">
          {BRAND.name}
        </h1>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          {BRAND.tagline}
        </p>
      </Link>

      {/* Pillars */}
      <nav className="flex flex-1 flex-col gap-7">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="mb-2">
              <p className="text-sm font-bold uppercase tracking-wide text-ink">
                {section.title}
              </p>
              <p
                className={`text-[11px] uppercase tracking-[0.14em] ${
                  section.accent === "green"
                    ? "text-brand-green"
                    : "text-brand-blue"
                }`}
              >
                {section.tagline}
              </p>
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href + "/"));
                return (
                  <li key={link.href}>
                    <NavItem
                      link={link}
                      accent={section.accent}
                      active={active}
                      onNavigate={onNavigate}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Search */}
      <form
        action="/search"
        className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-ink-faint"
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
          className="w-full bg-transparent text-sm uppercase tracking-wide text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </form>

      {/* Social */}
      <div className="flex items-center gap-4 border-t border-line pt-5 text-ink-soft">
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

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-white/90 px-5 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="text-base font-extrabold tracking-tight">
          {BRAND.name}
        </Link>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-1.5 text-ink hover:bg-slate-100"
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
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width)] max-w-[85vw] transform border-r border-line bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarBody onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
}
