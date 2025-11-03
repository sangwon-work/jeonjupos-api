import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class OrderFoodDto {
  @IsOptional()
  @IsNumber()
  orderfoodpkey = 0;

  @IsNotEmpty()
  @IsNumber()
  foodpkey: number;

  @IsNotEmpty()
  @IsNumber()
  ordercount: number;
}
