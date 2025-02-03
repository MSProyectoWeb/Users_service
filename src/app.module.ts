import { Module } from '@nestjs/common';
import { UsersModule } from './usuarios/usuarios.module';
import { UsersController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RolesController } from './roles/roles.controller';
import { SubscriptionsService } from './suscriptions/suscriptions.service';
import { SubscriptionsController } from './suscriptions/suscriptions.controller';
import { RolesModule } from './roles/roles.module';
import { SubscriptionsModule } from './suscriptions/suscriptions.module';
import { LoginModule } from './login/login.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RecuperarPasswordModule } from './recuperar-password/recuperar-password.module';
import { RecuperarPasswordController } from './recuperar-password/recuperar-password.controller';
import { RecuperarPasswordService } from './recuperar-password/recuperar-password.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"App Gym Gestión" <${process.env.MAIL_USER}>`,
      },
    }),
    UsersModule, PrismaModule, RolesModule, SubscriptionsModule, LoginModule, RecuperarPasswordModule ],
  controllers: [UsersController, RolesController, SubscriptionsController, RecuperarPasswordController, AppController],
  providers: [UsuariosService, PrismaService, SubscriptionsService,RecuperarPasswordService, AppService],
})
export class AppModule {}

