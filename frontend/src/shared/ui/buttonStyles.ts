export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-contrast hover:bg-accent-ink',
  secondary: 'border border-line bg-surface text-ink hover:bg-surface-sunken',
  ghost: 'text-accent-ink hover:bg-surface-sunken',
};

/** Estilos compartidos por `Button` y `ButtonLink` (un solo lugar para las variantes). */
export const buttonClasses = (variant: ButtonVariant = 'primary', className = '') =>
  `${base} ${variants[variant]} ${className}`.trim();
