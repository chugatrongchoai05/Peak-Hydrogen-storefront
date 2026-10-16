import type { ButtonHTMLAttributes } from "react";
import { Link } from "~/components/ui/link";

type Variant = "primary" | "outline";

const base = "inline-flex items-center justify-center rounded px-6 py-3 text-sm font-medium transition";
const variants: Record<Variant, string> = {
  primary: "bg-primary text-background hover:opacity-90",
  outline: "border border-foreground text-foreground hover:bg-foreground hover:text-background"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  to?: string;
};

export function Button({ variant = "primary", to, className = "", ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes}>
        {props.children}
      </Link>
    );
  }
  return <button className={classes} {...props} />;
}