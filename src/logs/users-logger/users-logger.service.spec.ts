import { Test, TestingModule } from '@nestjs/testing';
import { UsersLoggerService } from './users-logger.service';

describe('UsersLoggerService', () => {
  let service: UsersLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersLoggerService],
    }).compile();

    service = module.get<UsersLoggerService>(UsersLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
