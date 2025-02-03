import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginService } from './login.service';
import { LoginDto } from '../dto/login.dto';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @MessagePattern({ cmd: 'validate_user' })
  async login(loginDto: LoginDto) {
    try {
      return await this.loginService.validateUser(loginDto);
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        statusCode: error.status || 500
      };
    }
  }
}
