import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsersController } from './usuarios.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserLoggerService } from '../logs/users-logger/users-logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsuariosService, UserLoggerService],
  exports: [UsuariosService],
})
export class UsersModule {}
