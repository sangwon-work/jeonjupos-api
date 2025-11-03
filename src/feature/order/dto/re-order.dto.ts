import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderFoodDto } from './order-food.dto';

export class ReOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderinfopkey: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderFoodDto)
  orderfoodlist: OrderFoodDto[] = [];
}
