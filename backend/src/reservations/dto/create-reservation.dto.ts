import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  userId!: number;

  @IsNotEmpty({ message: 'Concert ID is required' })
  @IsNumber({}, { message: 'Concert ID must be a number' })
  concertId!: number;
}
