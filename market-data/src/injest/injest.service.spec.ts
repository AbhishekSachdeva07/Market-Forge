import { Test, TestingModule } from '@nestjs/testing';
import { InjestService } from './injest.service';

describe('InjestService', () => {
  let service: InjestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InjestService],
    }).compile();

    service = module.get<InjestService>(InjestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
