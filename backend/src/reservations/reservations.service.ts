import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReservationDto) {
    // Check user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    // Check concert exists
    const concert = await this.prisma.concert.findUnique({
      where: { id: dto.concertId },
    });
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${dto.concertId} not found`);
    }

    // Check if user already has an active reservation for this concert
    const existingReservation = await this.prisma.reservation.findUnique({
      where: {
        userId_concertId: {
          userId: dto.userId,
          concertId: dto.concertId,
        },
      },
    });

    if (existingReservation && existingReservation.status === 'RESERVED') {
      throw new ConflictException(
        'You already have a reservation for this concert',
      );
    }

    // Use transaction to ensure seat availability (prevent overbooking)
    return this.prisma.$transaction(async (tx) => {
      const reservedCount = await tx.reservation.count({
        where: {
          concertId: dto.concertId,
          status: 'RESERVED',
        },
      });

      if (reservedCount >= concert.seat) {
        throw new BadRequestException('No seats available for this concert');
      }

      // If there was a cancelled reservation, update it back to RESERVED
      if (existingReservation && existingReservation.status === 'CANCELLED') {
        return tx.reservation.update({
          where: { id: existingReservation.id },
          data: { status: 'RESERVED' },
          include: { concert: true, user: true },
        });
      }

      return tx.reservation.create({
        data: {
          userId: dto.userId,
          concertId: dto.concertId,
          status: 'RESERVED',
        },
        include: { concert: true, user: true },
      });
    });
  }

  async cancel(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    if (reservation.status === 'CANCELLED') {
      throw new BadRequestException('Reservation is already cancelled');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { concert: true, user: true },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: { concert: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      include: { concert: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
