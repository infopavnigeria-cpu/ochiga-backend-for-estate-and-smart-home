import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsJSON } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

  @IsOptional()
  @IsJSON()
  media?: any;
}
