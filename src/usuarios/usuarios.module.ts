import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsersController } from './usuarios.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsersModule {}
