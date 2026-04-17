import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

describe('ConcertsController', () => {
  let controller: ConcertsController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [{ provide: ConcertsService, useValue: mockService }],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all concerts', async () => {
      const concerts = [{ id: 1, name: 'Concert 1' }];
      mockService.findAll.mockResolvedValue(concerts);

      const result = await controller.findAll();

      expect(result).toEqual(concerts);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should return stats', async () => {
      const stats = { totalSeats: 700, totalReserved: 3, totalCancelled: 1 };
      mockService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toEqual(stats);
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', async () => {
      const concert = { id: 1, name: 'Concert 1' };
      mockService.findOne.mockResolvedValue(concert);

      const result = await controller.findOne(1);

      expect(result).toEqual(concert);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a concert', async () => {
      const dto = { name: 'New Concert', description: 'Desc', seat: 300 };
      const created = { id: 3, ...dto };
      mockService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(result).toEqual(created);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('should delete a concert', async () => {
      mockService.remove.mockResolvedValue({
        message: 'Concert deleted successfully',
      });

      const result = await controller.remove(1);

      expect(result.message).toBe('Concert deleted successfully');
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });
});
