import { Injectable } from '@nestjs/common';
import { GetStoreTableByInStoreService } from '../service/get-store-table-by-in-store.service';

@Injectable()
export class GetStoreTableListFacadeService {
  constructor(
    private readonly getStoreTableByInStoreService: GetStoreTableByInStoreService,
  ) {}

  async getStoreTableList(storepkey: number) {
    try {
      const { storetableset } =
        await this.getStoreTableByInStoreService.getStoreTableList(storepkey);

      return { data: { storetableset: storetableset } };
    } catch (err) {
      throw err;
    }
  }
}
