import Link from "next/link";
import AdminIcon from "./AdminIcon";
import { PageHeader, btnPrimary, btnGhost } from "./ui";

/** Shared header for page editors: back link, title, View + Save actions. */
export default function EditorHeader({
  title,
  description,
  viewHref,
  onSave,
  saving,
  saved,
}: {
  title: string;
  description: string;
  viewHref: string;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
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
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-semibold text-brand-green">
                Saved ✓
              </span>
            )}
            <Link href={viewHref} target="_blank" className={btnGhost}>
              <AdminIcon name="external" className="h-4 w-4" />
              View page
            </Link>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className={`${btnPrimary} disabled:opacity-60`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      />
    </>
  );
}
