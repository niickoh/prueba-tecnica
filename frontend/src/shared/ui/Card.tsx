import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'article' | 'div';
};

export function Card({ as: Component = 'section', className = '', ...props }: CardProps) {
  return (
    <Component
      className={`rounded-xl border border-line bg-surface p-4 sm:p-5 ${className}`}
      {...props}
    />
  );
}
