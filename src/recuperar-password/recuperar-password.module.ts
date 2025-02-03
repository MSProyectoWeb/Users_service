import { Module } from '@nestjs/common';
import { RecuperarPasswordService } from './recuperar-password.service';
import { RecuperarPasswordController } from './recuperar-password.controller';
import { UsersModule } from 'src/usuarios/usuarios.module';

@Module({
  imports:[UsersModule],
  controllers: [RecuperarPasswordController],
  providers: [RecuperarPasswordService],
  exports: [RecuperarPasswordService],
})
export class RecuperarPasswordModule {}
