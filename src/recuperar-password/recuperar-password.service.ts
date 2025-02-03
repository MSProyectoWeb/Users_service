import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class RecuperarPasswordService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UsuariosService, // Servicio externo para actualizar la contraseña
  ) {}

  // Método para manejar la recuperación de contraseña
  async handlePasswordRecovery(email: string) {
    // Genera un código aleatorio como nueva contraseña temporal
    const newPassword = this.generateRandomCode();

    try {
      // Actualiza la contraseña del usuario
      await this.userService.updateUserPassword(email, newPassword);
      // Enviar el correo con la nueva contraseña
      await this.sendPlainTextEmail(
        email,
        'Recuperación de contraseña de Gym App',
        `Tu nueva contraseña temporal de Gym App es: ${newPassword}`,
      );
    } catch (error) {
      console.error('Error en la recuperación de contraseña:', error);
      throw error;
    }
  }

  // Método para enviar correos en texto plano
  async sendPlainTextEmail(to: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to, // Dirección del destinatario
        subject, // Asunto
        text: content, // Contenido en texto plano
      });
      console.log(`Correo enviado a ${to}`);
    } catch (error) {
      console.error('Error enviando el correo:', error);
      throw error;
    }
  }

  // Método para generar un código aleatorio
  private generateRandomCode(): string {
    return Math.random().toString(36).slice(2, 10); // Genera un string aleatorio de 8 caracteres
  }
}
