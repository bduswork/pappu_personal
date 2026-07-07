import type { ReactNode } from "react";
import { Card } from "./ui";

const TONES: Record<string, string> = {
  blue: "bg-brand-blue-tint text-brand-blue-dark",
  green: "bg-brand-green-soft text-brand-green-dark",
  amber: "bg-amber-100 text-amber-700",
  slate: "bg-slate-100 text-ink-soft",
};

/** A content-block card with a colored label badge + optional hint/actions. */
export default function BlockCard({
  label,
  tone = "blue",
  hint,
  action,
  children,
  className = "mb-6",
}: {
  label: string;
  tone?: keyof typeof TONES;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${TONES[tone]}`}
        >
          {label}
        </span>
        {hint && <span className="text-xs text-ink-faint">{hint}</span>}
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {children}
    </Card>
  );
}
