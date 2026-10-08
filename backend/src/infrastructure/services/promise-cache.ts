interface Entry {
  value: Promise<unknown>;
  expiresAt: number;
}

/**
 * Caché en memoria de promesas con TTL. Guardar la promesa (y no el valor)
 * hace que llamadas concurrentes con la misma clave compartan una sola petición.
 * Los rechazos no se cachean.
 */
export class PromiseCache {
  private readonly entries = new Map<string, Entry>();

  constructor(
    private readonly ttlMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  get<T>(key: string, load: () => Promise<T>): Promise<T> {
    const current = this.now();
    const entry = this.entries.get(key);
    if (entry && entry.expiresAt > current) {
      return entry.value as Promise<T>;
    }

    const value = load();
    this.entries.set(key, { value, expiresAt: current + this.ttlMs });
    value.catch(() => {
      if (this.entries.get(key)?.value === value) {
        this.entries.delete(key);
      }
    });
    return value;
  }
}
