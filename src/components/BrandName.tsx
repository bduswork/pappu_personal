/**
 * Renders a brand/program name, turning a trailing trademark marker
 * ("™" or "(TM)") into a proper raised superscript — e.g. `Progression™`
 * renders as "Progression" with a small superscript "TM".
 * Pure render (no hooks) so it works in both server and client components.
 */
export default function BrandName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const match = name.match(/^([\s\S]*?)\s*(?:™|\(\s*tm\s*\))\s*$/i);
  if (!match || !match[1]) {
    return <span className={className}>{name}</span>;
  }
  return (
    <span className={className}>
      {match[1]}
      <sup className="ml-[0.08em] align-super text-[0.5em] font-bold tracking-normal">
        TM
      </sup>
    </span>
  );
}
