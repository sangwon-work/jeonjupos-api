import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetOrderInfoDto {
  @IsNotEmpty()
  @IsNumber()
  storetablepkey: number;
}
