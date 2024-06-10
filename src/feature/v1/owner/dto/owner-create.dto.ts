import { IsNotEmpty, IsString } from 'class-validator';

export class OwnerCreateDto {
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @IsNotEmpty()
  @IsString()
  ownerPassword: string;

  @IsNotEmpty()
  @IsString()
  ownerName: string;
}
