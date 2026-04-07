import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-3xl font-bold text-on-surface">{title}</h2>
        {description ? <p className="max-w-2xl text-sm text-on-surface-variant">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
