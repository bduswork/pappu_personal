import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import { Card, PageHeader } from "@/components/admin/ui";
import type { IconName } from "@/components/admin/AdminIcon";
import { prisma } from "@/lib/prisma";
import { getPrograms } from "@/lib/getPrograms";
import { getVentures } from "@/lib/getVentures";
import { getCustomPages } from "@/lib/getCustomPages";
import { getSubscribers } from "@/lib/getSubscribers";
import { NAV_SECTIONS, GLOBAL_LINKS, pagesInSection } from "@/lib/navigation";

export const dynamic = "force-dynamic";

const QUICK: { label: string; href: string; icon: IconName }[] = [
  { label: "Manage sections", href: "/admin/sections", icon: "sections" },
  { label: "Programs & classes", href: "/admin/training", icon: "training" },
  { label: "Enrollments", href: "/admin/enrollments", icon: "enrollments" },
  { label: "Upload media", href: "/admin/media", icon: "media" },
];

export default async function AdminDashboard() {
  // Everything here is read live from the database.
  const [
    programs,
    ventures,
    customPages,
    subscribers,
    enrollments,
    newEnrollments,
    messages,
    newMessages,
    media,
  ] = await Promise.all([
    getPrograms(),
    getVentures(),
    getCustomPages(),
    getSubscribers(),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.mediaAsset.count(),
  ]);

  const builtInPages =
    NAV_SECTIONS.reduce((n, s) => n + pagesInSection(s.key), 0) + GLOBAL_LINKS.length;

  const stats: {
    label: string;
    value: number;
    sub?: string;
    href: string;
    icon: IconName;
  }[] = [
    { label: "Sections", value: NAV_SECTIONS.length, href: "/admin/sections", icon: "sections" },
    {
      label: "Pages",
      value: builtInPages + customPages.length,
      sub: customPages.length > 0 ? `${customPages.length} custom` : undefined,
      href: "/admin/pages",
      icon: "pages",
    },
    { label: "Programs", value: programs.length, href: "/admin/training", icon: "training" },
    { label: "Ventures", value: ventures.length, href: "/admin/ventures", icon: "sections" },
    {
      label: "Enrollments",
      value: enrollments,
      sub: newEnrollments > 0 ? `${newEnrollments} new` : undefined,
      href: "/admin/enrollments",
      icon: "enrollments",
    },
    {
      label: "Messages",
      value: messages,
      sub: newMessages > 0 ? `${newMessages} new` : undefined,
      href: "/admin/messages",
      icon: "mail",
    },
    { label: "Subscribers", value: subscribers.length, href: "/admin/subscribers", icon: "articles" },
    { label: "Media", value: media, href: "/admin/media", icon: "media" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Manage every part of the site — sidebar, pages, and content."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green-tint">
                  <AdminIcon name={s.icon} className="h-5 w-5 text-brand-green" />
                </span>
                {s.sub ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                    {s.sub}
                  </span>
                ) : (
                  <AdminIcon name="external" className="h-4 w-4 text-ink-faint" />
                )}
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-ink">
                {s.value}
              </p>
              <p className="text-sm text-ink-soft">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
        Quick actions
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map((q) => (
          <Link key={q.label} href={q.href}>
            <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-tint">
                <AdminIcon name={q.icon} className="h-5 w-5 text-brand-blue" />
              </span>
              <span className="text-sm font-semibold text-ink">{q.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
