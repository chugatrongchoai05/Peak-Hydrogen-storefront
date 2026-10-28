import type { ButtonHTMLAttributes } from 'react';
import { Link } from '~/components/ui/link';
import { cn } from '~/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'underline';

const base = 'inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider transition';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary px-6 py-3 text-background hover:opacity-85',
  secondary: 'bg-accent px-6 py-3 text-foreground hover:opacity-85',
  outline: 'border border-current px-6 py-3 hover:opacity-70',
  underline: 'underline decoration-2 underline-offset-4 hover:opacity-70',
};

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string) {
  return cn(base, variants[variant], className);
}

export function isExternalLink(to: string) {
  return /^(https?:)?\/\//.test(to) || to.startsWith('mailto:') || to.startsWith('tel:');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  to?: string;
};

export function Button({ variant = 'primary', to, className, children, ...props }: ButtonProps) {
  const classes = buttonClasses(variant, className);
  if (to) {
    return isExternalLink(to) ? (
      <a href={to} className={classes} rel='noreferrer'>
        {children}
      </a>
    ) : (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}