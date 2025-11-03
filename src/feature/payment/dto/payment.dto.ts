import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsNumber()
  orderinfopkey: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['CASH', 'CARD', 'POSTPAY'])
  paytype: 'CASH' | 'CARD' | 'POSTPAY';

  @IsNotEmpty()
  @IsNumber()
  payamount: number;
}
