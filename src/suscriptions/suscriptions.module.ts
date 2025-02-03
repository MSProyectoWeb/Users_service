import { Module } from '@nestjs/common';
import { SubscriptionsService } from './suscriptions.service';
import { SubscriptionsController } from './suscriptions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
