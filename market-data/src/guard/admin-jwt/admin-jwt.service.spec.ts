import { Test, TestingModule } from '@nestjs/testing';
import { AdminJwtService } from './admin-jwt.service';

describe('AdminJwtService', () => {
  let service: AdminJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminJwtService],
    }).compile();

    service = module.get<AdminJwtService>(AdminJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
