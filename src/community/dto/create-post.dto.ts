import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

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
  media?: any; // keep flexible for images/videos
}
