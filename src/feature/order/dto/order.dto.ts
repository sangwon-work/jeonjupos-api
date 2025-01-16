import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderFoodDto } from './order-food.dto';

export class OrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderinfopkey: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['INSTORE', 'TAKEOUT', 'DELIVERY'])
  ordertype: 'INSTORE' | 'TAKEOUT' | 'DELIVERY';

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderFoodDto)
  orderfoodlist: OrderFoodDto[] = [];
}
