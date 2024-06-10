import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @IsNotEmpty()
  @IsString()
  ownerPassword: string;
}
