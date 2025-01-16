import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderFoodDto {
  @IsNotEmpty()
  @IsNumber()
  foodpkey: number;

  @IsNotEmpty()
  @IsNumber()
  ordercount: number;
}
