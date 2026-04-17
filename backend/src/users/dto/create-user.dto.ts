import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  username!: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be ADMIN or USER' })
  role?: Role;
}
