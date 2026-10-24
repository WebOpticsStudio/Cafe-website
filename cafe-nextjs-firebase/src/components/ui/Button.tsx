import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'outline-inverse' | 'ghost';
export type ButtonSize = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[#1C1510] text-white hover:bg-[#120D0A] shadow-sm transition-all active:scale-[0.98]',
  accent: 'bg-[#C47935] text-white hover:bg-[#AC6426] shadow-sm transition-all active:scale-[0.98]',
  outline: 'border border-[#1C1510] text-[#1C1510] hover:bg-[#1C1510] hover:text-white transition-all active:scale-[0.98]',
  'outline-inverse': 'border border-white/80 text-white hover:bg-white hover:text-[#1C1510] transition-all active:scale-[0.98]',
  ghost: 'text-[#1C1510] hover:bg-[#1C1510]/5 transition-all',
};

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-12 px-6 text-base',
  sm: 'min-h-10 px-4 text-sm',
};

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(base, variants[variant], sizes[size]);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return <button type={type} className={cn(buttonClasses(variant, size), className)} {...props} />;
}

interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** A link that looks like a button. Internal paths use next/link; external URLs open safely in a new tab. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonClasses(variant, size), className);

  if (isExternal(href)) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (/^(mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
