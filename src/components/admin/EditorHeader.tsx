import Link from "next/link";
import AdminIcon from "./AdminIcon";
import { PageHeader, btnPrimary, btnGhost } from "./ui";

/** Shared header for page editors: back link, title, View + Save actions. */
export default function EditorHeader({
  title,
  description,
  viewHref,
}: {
  title: string;
  description: string;
  viewHref: string;
}) {
  return (
    <>
      <Link
        href="/admin/pages"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Pages
      </Link>
      <PageHeader
        title={title}
        description={description}
        action={
          <div className="flex gap-2">
            <Link href={viewHref} target="_blank" className={btnGhost}>
              <AdminIcon name="external" className="h-4 w-4" />
              View page
            </Link>
            <button type="button" className={btnPrimary}>
              Save changes
            </button>
          </div>
        }
      />
    </>
  );
}
