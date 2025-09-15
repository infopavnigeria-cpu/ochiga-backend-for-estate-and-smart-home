import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVisitorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsString()
  @IsNotEmpty()
  time: string;
}
