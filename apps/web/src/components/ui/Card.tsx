import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

export function Card({ className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl2 bg-surface-container-lowest p-6 transition duration-300 ease-kinetic",
        elevated ? "shadow-ambient hover:scale-[1.02]" : "",
        className,
      )}
      {...props}
    />
  );
}
