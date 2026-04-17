import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    concert: {
      findUnique: jest.fn(),
    },
    reservation: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { userId: 1, concertId: 1 };
    const mockUser = { id: 1, username: 'user', role: 'USER' };
    const mockConcert = { id: 1, name: 'Concert 1', seat: 500 };

    it('should create a reservation when seats are available', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.concert.findUnique.mockResolvedValue(mockConcert);
      mockPrisma.reservation.findUnique.mockResolvedValue(null);

      const mockReservation = {
        id: 1,
        userId: 1,
        concertId: 1,
        status: 'RESERVED',
        concert: mockConcert,
        user: mockUser,
      };

      mockPrisma.$transaction.mockImplementation(
        (fn: (tx: any) => Promise<any>) => {
          const tx = {
            reservation: {
              count: jest.fn().mockResolvedValue(100),
              create: jest.fn().mockResolvedValue(mockReservation),
            },
          };
          return fn(tx);
        },
      );

      const result = await service.create(dto);

      expect(result).toEqual(mockReservation);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when concert not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.concert.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when user already has an active reservation', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.concert.findUnique.mockResolvedValue(mockConcert);
      mockPrisma.reservation.findUnique.mockResolvedValue({
        id: 1,
        status: 'RESERVED',
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when no seats available', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.concert.findUnique.mockResolvedValue(mockConcert);
      mockPrisma.reservation.findUnique.mockResolvedValue(null);

      mockPrisma.$transaction.mockImplementation(
        (fn: (tx: any) => Promise<any>) => {
          const tx = {
            reservation: {
              count: jest.fn().mockResolvedValue(500), // Full capacity
              create: jest.fn(),
            },
          };
          return fn(tx);
        },
      );

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should re-reserve a cancelled reservation', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.concert.findUnique.mockResolvedValue(mockConcert);
      mockPrisma.reservation.findUnique.mockResolvedValue({
        id: 5,
        status: 'CANCELLED',
      });

      const updatedReservation = {
        id: 5,
        userId: 1,
        concertId: 1,
        status: 'RESERVED',
        concert: mockConcert,
        user: mockUser,
      };

      mockPrisma.$transaction.mockImplementation(
        (fn: (tx: any) => Promise<any>) => {
          const tx = {
            reservation: {
              count: jest.fn().mockResolvedValue(100),
              update: jest.fn().mockResolvedValue(updatedReservation),
            },
          };
          return fn(tx);
        },
      );

      const result = await service.create(dto);

      expect(result.status).toBe('RESERVED');
      expect(result.id).toBe(5);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        concertId: 1,
        status: 'RESERVED',
      };
      const cancelledReservation = {
        ...mockReservation,
        status: 'CANCELLED',
        concert: { id: 1, name: 'Concert 1' },
        user: { id: 1, username: 'user' },
      };

      mockPrisma.reservation.findUnique.mockResolvedValue(mockReservation);
      mockPrisma.reservation.update.mockResolvedValue(cancelledReservation);

      const result = await service.cancel(1);

      expect(result.status).toBe('CANCELLED');
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockPrisma.reservation.findUnique.mockResolvedValue(null);

      await expect(service.cancel(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when reservation already cancelled', async () => {
      mockPrisma.reservation.findUnique.mockResolvedValue({
        id: 1,
        status: 'CANCELLED',
      });

      await expect(service.cancel(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUser', () => {
    it('should return reservations for a specific user', async () => {
      const mockReservations = [
        {
          id: 1,
          userId: 1,
          concertId: 1,
          status: 'RESERVED',
          concert: { name: 'Concert 1' },
        },
        {
          id: 2,
          userId: 1,
          concertId: 2,
          status: 'CANCELLED',
          concert: { name: 'Concert 2' },
        },
      ];

      mockPrisma.reservation.findMany.mockResolvedValue(mockReservations);

      const result = await service.findByUser(1);

      expect(result).toHaveLength(2);
      expect(mockPrisma.reservation.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { concert: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const mockReservations = [
        { id: 1, userId: 1, concertId: 1, status: 'RESERVED' },
      ];

      mockPrisma.reservation.findMany.mockResolvedValue(mockReservations);

      const result = await service.findAll();

      expect(result).toEqual(mockReservations);
      expect(mockPrisma.reservation.findMany).toHaveBeenCalledWith({
        include: { concert: true, user: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
