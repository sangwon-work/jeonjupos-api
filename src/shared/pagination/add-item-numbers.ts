export function addItemNumbers<T>(
  items: T[],
  page: number,
  limit: 30 | 50 | 100,
): T[] {
  let id = page === 1 ? 1 : (page - 1) * limit + 1;
  return items.map((item) => {
    return { ...item, id: id++ };
  });
}
