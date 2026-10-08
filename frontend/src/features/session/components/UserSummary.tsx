import { useSessionStore } from '../hooks/useSessionStore';

export function UserSummary() {
  const user = useSessionStore((state) => state.user);
  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <img
        src={user.profileImage}
        alt=""
        width={32}
        height={32}
        className="size-8 rounded-full border border-line object-cover"
      />
      <div className="hidden flex-col leading-tight sm:flex">
        <span className="text-sm font-medium text-ink">{user.fullName}</span>
        <span className="text-xs text-ink-secondary">{user.area}</span>
      </div>
      <span className="sr-only sm:hidden">Sesión de {user.fullName}</span>
    </div>
  );
}
