import { Controller } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-rol.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()  // Quitamos 'roles' ya que es un microservicio
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'create_rol' })
  async create(createRolDto: CreateRolDto) {
    try {
      return await this.rolesService.create(createRolDto);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'find_all_roles' })
  async findAll() {
    try {
      return await this.rolesService.findAll();
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'find_one_rol' })
  async findOne(data: { id: number }) {
    try {
      return await this.rolesService.findOne(data.id);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'update_rol' })
  async update(data: { id: number; updateRolDto: UpdateRolDto }) {
    try {
      return await this.rolesService.update(data.id, data.updateRolDto);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @MessagePattern({ cmd: 'delete_rol' })
  async remove(data: { id: number }) {
    try {
      return await this.rolesService.remove(data.id);
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}