import type { HTMLAttributes } from "react";

export function Section({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16 ${className}`} {...props} />;
}