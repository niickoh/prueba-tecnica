import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/requests', label: 'Solicitudes', end: false },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
    isActive ? 'bg-surface-sunken text-ink' : 'text-ink-secondary hover:text-ink'
  }`;

/** `userSlot` evita que el header compartido dependa de una feature concreta. */
export function Header({ userSlot }: { userSlot?: ReactNode }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <Link to="/" className="text-base font-bold tracking-tight text-ink">
          Centro de Solicitudes
        </Link>
        <div className="order-last flex w-full sm:order-none sm:w-auto">
          <nav aria-label="Principal">
            <ul className="flex gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {userSlot}
      </div>
    </header>
  );
}
