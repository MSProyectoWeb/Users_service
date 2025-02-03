// Microservicio - services/users/src/recuperar-password/recuperar-password.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RecuperarPasswordService } from './recuperar-password.service';

@Controller()
export class RecuperarPasswordController {
  constructor(private readonly recuperarPasswordService: RecuperarPasswordService) {}

  @MessagePattern({ cmd: 'send_recovery_email' })
  async sendEmail(data: { email: string }) {
    try {
      if (!data.email) {
        return {
          status: 'error',
          message: 'Email es requerido',
          statusCode: 400
        };
      }

      await this.recuperarPasswordService.handlePasswordRecovery(data.email);

      return {
        status: 'success',
        message: `Correo enviado exitosamente a ${data.email}.`
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error al procesar la solicitud: ${error.message}`,
        statusCode: 500
      };
    }
  }
}

