import { Link, type LinkProps } from 'react-router';
import { buttonClasses, type ButtonVariant } from './buttonStyles';

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
}

export function ButtonLink({ variant = 'secondary', className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
