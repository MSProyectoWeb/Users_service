import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`],
      queue: process.env.RABBITMQ_QUEUE,
      queueOptions: {
        durable: false,  // Cambiado a false para mantener consistencia
      },
    },
  });

  try {
    await app.listen();
    console.log('Microservicio de usuarios está escuchando');
  } catch (error) {
    console.error('Error al iniciar el microservicio de usuarios:', error);
    process.exit(1);
  }
}
bootstrap();

