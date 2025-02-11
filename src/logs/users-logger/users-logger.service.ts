// services/users/src/logs/user-logger.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogLevel } from '@prisma/client';

@Injectable()
export class UserLoggerService {
  constructor(private prisma: PrismaService) {}

  async logUserAction(data: {
    action: string;
    entity: string;
    entityId?: string;
    message: string;
    metadata?: any;
    level: LogLevel;
  }) {
    return this.prisma.userLog.create({
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });
  }
}
