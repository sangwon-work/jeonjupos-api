import { Module } from '@nestjs/common';
import { PaginationModel } from './pagination.model';
import { OffsetPaginationService } from './offset-pagination.service';

@Module({
  providers: [PaginationModel, OffsetPaginationService],
  exports: [OffsetPaginationService],
})
export class PaginationModule {}
