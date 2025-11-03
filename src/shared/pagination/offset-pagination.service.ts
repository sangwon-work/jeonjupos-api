// src/shared/pagination/offset-pagination.service.ts
import { Injectable } from '@nestjs/common';
import {
  OffsetPageOptions,
  OffsetPaginatedResult,
  OrderBy,
} from './offset.types';
import { sanitizeOrderBy, orderByToSql } from './offset-order.util';
import { DatabaseService } from '../../core/database/database.service';
import { PaginationModel } from './pagination.model';

export const MYSQL_POOL = 'MYSQL_POOL';

@Injectable()
export class OffsetPaginationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationModel: PaginationModel,
  ) {}

  /**
   * baseSql: SELECT ... FROM ... WHERE ...   (ORDER/LIMIT/; 없음)
   * params : baseSql의 바인딩 파라미터
   * orderWhitelist: 정렬 허용 컬럼 목록
   *
   * - rows는 (limit+1)로 받아 hasNext 판별
   * - withTotal=true일 때만 COUNT(*) 수행
   */
  async paginate<T = any>({
    baseSql,
    params = [],
    pageOptions,
    orderBy,
    orderWhitelist,
    defaultOrder = [{ column: 'slug', direction: 'DESC' }],
  }: {
    baseSql: string;
    params?: any[];
    pageOptions: OffsetPageOptions;
    orderBy?: OrderBy[];
    orderWhitelist: readonly string[];
    defaultOrder?: OrderBy[];
  }): Promise<OffsetPaginatedResult<T>> {
    const page = Math.max(1, Math.floor(pageOptions.page || 1));
    const rawLimit = Math.floor(pageOptions.limit || 20);
    const limit = Math.min(Math.max(rawLimit, 1), 100); // 1..100 가드
    const offset = (page - 1) * limit;

    const safeOrders = sanitizeOrderBy(orderBy, orderWhitelist, defaultOrder);
    const orderSql = orderByToSql(safeOrders);

    const listSql = `${baseSql}${orderSql} LIMIT ? OFFSET ?`;

    const connection = await this.databaseService.getDBConnection();
    try {
      const rowset = await this.paginationModel.getList(connection, listSql, [
        ...params,
        limit + 1,
        offset,
      ]); // +1로 hasNext 판별
      const has_next = rowset.length > limit;
      const items = has_next ? rowset.slice(0, limit) : rowset;

      let total: number | undefined;
      let total_pages: number | undefined;
      if (pageOptions.withTotal) {
        const countSql = `SELECT COUNT(*) AS cnt FROM (${baseSql}) AS _c`;
        const cntRows = await this.paginationModel.getCount(
          connection,
          countSql,
          params,
        );
        total = cntRows[0]?.cnt ?? 0;
        total_pages = Math.ceil(total! / limit);
      }

      return {
        items,
        meta: {
          mode: 'offset',
          page,
          limit,
          total,
          total_pages,
          has_next,
        },
      };
    } finally {
      connection?.release();
    }
  }
}
