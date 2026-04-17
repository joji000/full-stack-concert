import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;

  const mockPrisma = {
    concert: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all concerts with reservation counts', async () => {
      const mockConcerts = [
        {
          id: 1,
          name: 'Concert 1',
          description: 'Description 1',
          seat: 500,
          createdAt: new Date(),
          _count: { reservations: 120 },
        },
        {
          id: 2,
          name: 'Concert 2',
          description: 'Description 2',
          seat: 200,
          createdAt: new Date(),
          _count: { reservations: 50 },
        },
      ];

      mockPrisma.concert.findMany.mockResolvedValue(mockConcerts);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].reservedCount).toBe(120);
      expect(result[0].availableSeats).toBe(380);
      expect(result[1].reservedCount).toBe(50);
      expect(result[1].availableSeats).toBe(150);
      expect(mockPrisma.concert.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', async () => {
      const mockConcert = {
        id: 1,
        name: 'Concert 1',
        description: 'Description 1',
        seat: 500,
        createdAt: new Date(),
        _count: { reservations: 120 },
      };

      mockPrisma.concert.findUnique.mockResolvedValue(mockConcert);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.reservedCount).toBe(120);
      expect(result.availableSeats).toBe(380);
    });

    it('should throw NotFoundException when concert not found', async () => {
      mockPrisma.concert.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new concert', async () => {
      const dto = {
        name: 'New Concert',
        description: 'New Description',
        seat: 300,
      };
      const mockConcert = { id: 3, ...dto, createdAt: new Date() };

      mockPrisma.concert.create.mockResolvedValue(mockConcert);

      const result = await service.create(dto);

      expect(result).toEqual(mockConcert);
      expect(mockPrisma.concert.create).toHaveBeenCalledWith({
        data: { name: dto.name, description: dto.description, seat: dto.seat },
      });
    });
  });

  describe('remove', () => {
    it('should delete a concert', async () => {
      const mockConcert = {
        id: 1,
        name: 'Concert 1',
        description: 'Desc',
        seat: 500,
        createdAt: new Date(),
      };
      mockPrisma.concert.findUnique.mockResolvedValue(mockConcert);
      mockPrisma.concert.delete.mockResolvedValue(mockConcert);

      const result = await service.remove(1);

      expect(result.message).toBe('Concert deleted successfully');
      expect(mockPrisma.concert.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when concert not found', async () => {
      mockPrisma.concert.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return aggregate stats', async () => {
      const mockConcerts = [
        {
          id: 1,
          seat: 500,
          reservations: [
            { status: 'RESERVED' },
            { status: 'RESERVED' },
            { status: 'CANCELLED' },
          ],
        },
        {
          id: 2,
          seat: 200,
          reservations: [{ status: 'RESERVED' }],
        },
      ];

      mockPrisma.concert.findMany.mockResolvedValue(mockConcerts);

      const result = await service.getStats();

      expect(result.totalSeats).toBe(700);
      expect(result.totalReserved).toBe(3);
      expect(result.totalCancelled).toBe(1);
    });
  });
});
