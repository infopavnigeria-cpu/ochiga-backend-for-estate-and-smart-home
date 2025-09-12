import { IsNotEmpty } from 'class-validator';

export class RegisterResidentDto {
  @IsNotEmpty()
  inviteToken!: string;

  @IsNotEmpty()
  password!: string;
}
