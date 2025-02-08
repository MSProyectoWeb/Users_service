// src/app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { SubscriptionsModule } from './suscriptions/suscriptions.module';
import { LoginModule } from './login/login.module';
import { RecuperarPasswordModule } from './recuperar-password/recuperar-password.module';
import { MailerModule } from '@nestjs-modules/mailer';
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
    UsersModule,
    PrismaModule,
    RolesModule,
    SubscriptionsModule,
    LoginModule,
    RecuperarPasswordModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}