"use client";

import Link from "next/link";
import { useState } from "react";
import AdminIcon from "./AdminIcon";
import BlockCard from "./BlockCard";

/**
 * A block that DISPLAYS a reusable collection (Press, Events, Videos…) rather
 * than re-entering the data. Items are managed in Collections; here you only
 * choose the heading and how many to show. Reinforces "no redundancy".
 */
export default function CollectionBlock({
  label,
  collection,
  href,
  defaultHeading,
  defaultLimit = 3,
  note,
}: {
  label: string;
  collection: string;
  href: string;
  defaultHeading: string;
  defaultLimit?: number;
  note?: string;
}) {
  const [heading, setHeading] = useState(defaultHeading);
  const [limit, setLimit] = useState(defaultLimit);

  return (
    <BlockCard
      label={label}
      tone="green"
      hint={`displays the ${collection} collection`}
      action={
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-brand-green-dark hover:bg-brand-green-soft"
        >
          Manage {collection} →
        </Link>
      }
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="block flex-1">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Section heading
          </span>
          <input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
          />
        </label>
        <label className="block w-28">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Show
          </span>
          <input
            type="number"
            min={1}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
          />
        </label>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
        <AdminIcon name="external" className="h-3.5 w-3.5" />
        {note ??
          `Items live in Collections → ${collection}. Add or edit them there; this block just shows the latest ${limit}.`}
      </p>
    </BlockCard>
  );
}
