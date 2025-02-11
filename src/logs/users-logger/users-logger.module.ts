// src/logs/users-logger/users-logger.module.ts
import { Module } from '@nestjs/common';
import { UserLoggerService } from './users-logger.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserLoggerService],
  exports: [UserLoggerService],
})
export class UserLoggerModule {}