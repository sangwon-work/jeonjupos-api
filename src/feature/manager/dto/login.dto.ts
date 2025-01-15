import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  mid: string;

  @IsNotEmpty()
  @IsString()
  mpassword: string;
}
