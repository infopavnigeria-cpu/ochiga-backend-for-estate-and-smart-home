import { IsOptional, IsString, IsBoolean, IsJSON } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

  @IsOptional()
  @IsJSON()
  media?: any;
}
