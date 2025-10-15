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

export class FirstOrderDto {
  @IsNotEmpty()
  @IsNumber()
  storetablepkey: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['DINEIN', 'TAKEOUT', 'DELIVERY'])
  servicetype: 'DINEIN' | 'TAKEOUT' | 'DELIVERY';

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderFoodDto)
  orderfoodlist: OrderFoodDto[] = [];
}
