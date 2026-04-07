import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function FilterChip({ active = false, className, ...props }: FilterChipProps) {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-sm transition duration-300 ease-kinetic",
        active
          ? "bg-primary text-white shadow-ambient"
          : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low",
        className,
      )}
      {...props}
    />
  );
}
