import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetFoodListDto {
  @IsNotEmpty()
  @IsNumber()
  foodcategorypkey: number;
}
