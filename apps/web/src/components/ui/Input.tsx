import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-2 text-sm text-on-surface-variant" htmlFor={inputId}>
      <span>{label}</span>
      <span
        className={cn(
          "relative flex items-center overflow-hidden rounded-3xl bg-surface-container-high px-4 py-1 transition duration-300 ease-kinetic focus-within:ghost-border",
          error ? "ghost-border" : "",
        )}
      >
        <span className="mr-3 h-8 w-0.5 rounded-full bg-primary/20" aria-hidden="true" />
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none",
            className,
          )}
          {...props}
        />
      </span>
      {error ? <span className="text-xs text-error">{error}</span> : null}
    </label>
  );
});
