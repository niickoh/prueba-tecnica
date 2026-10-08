export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only rounded-lg bg-accent px-4 py-2 text-accent-contrast focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10"
    >
      Saltar al contenido
    </a>
  );
}
