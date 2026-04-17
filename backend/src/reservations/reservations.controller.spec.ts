import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;

  const mockService = {
    create: jest.fn(),
    cancel: jest.fn(),
    findByUser: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [{ provide: ReservationsService, useValue: mockService }],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation', async () => {
      const dto = { userId: 1, concertId: 1 };
      const reservation = { id: 1, ...dto, status: 'RESERVED' };
      mockService.create.mockResolvedValue(reservation);

      const result = await controller.create(dto);

      expect(result).toEqual(reservation);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      const reservation = { id: 1, status: 'CANCELLED' };
      mockService.cancel.mockResolvedValue(reservation);

      const result = await controller.cancel(1);

      expect(result.status).toBe('CANCELLED');
      expect(mockService.cancel).toHaveBeenCalledWith(1);
    });
  });

  describe('findByUser', () => {
    it('should return reservations for a user', async () => {
      const reservations = [{ id: 1, userId: 1 }];
      mockService.findByUser.mockResolvedValue(reservations);

      const result = await controller.findByUser(1);

      expect(result).toEqual(reservations);
      expect(mockService.findByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [{ id: 1 }, { id: 2 }];
      mockService.findAll.mockResolvedValue(reservations);

      const result = await controller.findAll();

      expect(result).toEqual(reservations);
    });
  });
});
