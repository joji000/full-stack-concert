import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const concerts = await this.prisma.concert.findMany({
      include: {
        _count: {
          select: {
            reservations: {
              where: { status: 'RESERVED' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return concerts.map((concert) => ({
      id: concert.id,
      name: concert.name,
      description: concert.description,
      seat: concert.seat,
      createdAt: concert.createdAt,
      reservedCount: concert._count.reservations,
      availableSeats: concert.seat - concert._count.reservations,
    }));
  }

  async findOne(id: number) {
    const concert = await this.prisma.concert.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reservations: {
              where: { status: 'RESERVED' },
            },
          },
        },
      },
    });
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    return {
      ...concert,
      reservedCount: concert._count.reservations,
      availableSeats: concert.seat - concert._count.reservations,
    };
  }

  async create(dto: CreateConcertDto) {
    return this.prisma.concert.create({
      data: {
        name: dto.name,
        description: dto.description,
        seat: dto.seat,
      },
    });
  }

  async remove(id: number) {
    const concert = await this.prisma.concert.findUnique({ where: { id } });
    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
    await this.prisma.concert.delete({ where: { id } });
    return { message: 'Concert deleted successfully' };
  }

  async getStats() {
    const concerts = await this.prisma.concert.findMany({
      include: {
        reservations: {
          select: { status: true },
        },
      },
    });

    let totalSeats = 0;
    let totalReserved = 0;
    let totalCancelled = 0;

    for (const concert of concerts) {
      totalSeats += concert.seat;
      for (const reservation of concert.reservations) {
        if (reservation.status === 'RESERVED') totalReserved++;
        if (reservation.status === 'CANCELLED') totalCancelled++;
      }
    }

    return { totalSeats, totalReserved, totalCancelled };
  }
}
