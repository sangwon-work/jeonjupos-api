import { OrderBy, OrderDirection } from './offset.types';

export function sanitizeOrderBy(
  requested: OrderBy[] | undefined,
  white_list: readonly string[],
  fallback: OrderBy[] = [{ column: 'id', direction: 'DESC' }],
): OrderBy[] {
  if (!requested?.length) return fallback;
  const wl = new Set(white_list);
  const cleaned = requested
    .filter((o) => wl.has(o.column))
    .map((o) => ({
      column: o.column,
      direction: (o.direction ?? 'ASC').toUpperCase() as OrderDirection,
    }));
  return cleaned.length ? cleaned : fallback;
}

export function orderByToSql(orders: OrderBy[]): string {
  if (!orders.length) return '';
  const parts = orders.map((o) => `\`${o.column}\` ${o.direction}`);
  return ` ORDER BY ${parts.join(', ')}`;
}

export function parseOrderBy(sort: string): OrderBy[] | undefined {
  return sort
    ? sort.split(',').map((pair) => {
        const [col, dir] = pair.split(':');
        return {
          column: col,
          direction: (dir ?? 'ASC').toUpperCase() as any,
        };
      })
    : [];
}
