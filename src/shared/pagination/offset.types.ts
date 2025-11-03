export type OrderDirection = 'ASC' | 'DESC';

export interface OrderBy {
  column: string;
  direction?: OrderDirection;
}

export interface OffsetPageOptions {
  page: number;
  limit: number;
  withTotal?: boolean; // true면 count(*) 수행
}

export interface OffsetPaginatedResult<T> {
  items: T[];
  meta: {
    mode: 'offset';
    page: number;
    limit: number;
    total?: number;
    total_pages?: number;
    has_next?: boolean;
  };
}
