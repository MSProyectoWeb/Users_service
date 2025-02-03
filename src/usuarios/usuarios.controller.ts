import { Controller } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()  // Quita el 'users' ya que es un microservicio
export class UsersController {
  constructor(private readonly usersService: UsuariosService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'get_usuarios' })
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'get_user_by_id' })
  async findOne(data: { id: number }) {
    try {
      return await this.usersService.findOne(data.id);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  async update(data: { id: number; updateUserDto: UpdateUserDto }) {
    try {
      return await this.usersService.update(data.id, data.updateUserDto);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'delete_user' })
  async remove(data: { id: number }) {
    try {
      return await this.usersService.remove(data.id);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'update_user_password' })
  async updatePassword(data: { correo: string; newPassword: string }) {
    try {
      if (!data.correo || !data.newPassword) {
        throw new Error('El correo y la nueva contraseña son requeridos.');
      }

      const updatedUser = await this.usersService.updateUserPassword(
        data.correo,
        data.newPassword
      );

      return {
        status: 'success',
        message: 'Contraseña actualizada exitosamente.',
        user: updatedUser,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error al actualizar la contraseña: ${error.message}`
      };
    }
  }
}