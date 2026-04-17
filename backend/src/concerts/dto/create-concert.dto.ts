import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty({ message: 'Concert name is required' })
  @IsString({ message: 'Concert name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description!: string;

  @IsNotEmpty({ message: 'Total seats is required' })
  @IsNumber({}, { message: 'Total seats must be a number' })
  @Min(1, { message: 'Total seats must be at least 1' })
  seat!: number;
}
