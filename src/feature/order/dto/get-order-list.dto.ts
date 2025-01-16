import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetOrderListDto {
  @IsNotEmpty()
  @IsNumber()
  storetablepkey: number;
}
