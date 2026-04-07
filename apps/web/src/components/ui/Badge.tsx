import { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "positive" | "alert";

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
  className?: string;
}>;

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-container-low text-on-surface-variant",
  positive: "bg-secondary-container/70 text-secondary",
  alert: "bg-error/10 text-error",
};

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
