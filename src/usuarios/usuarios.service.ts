import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SubscriptionsService } from '../suscriptions/suscriptions.service';
import { Prisma, LogLevel } from '@prisma/client';
import { UserLoggerService } from '../logs/users-logger/users-logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private userLogger: UserLoggerService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await this.hashPassword(
        createUserDto.cuenta.password,
      );

      const newUser = await this.prisma.usuario.create({
        data: {
          nombre: createUserDto.nombre,
          apellido: createUserDto.apellido,
          fechaNac: new Date(createUserDto.fechaNac),
          direccion: createUserDto.direccion,
          rolId: createUserDto.rolId,
          cuenta: {
            create: {
              username: createUserDto.cuenta.username,
              password: hashedPassword,
              correoRecuperacion: createUserDto.cuenta.correoRecuperacion,
            },
          },
          suscripcion: createUserDto.suscripcion ? {
            create: {
              tipo: createUserDto.suscripcion.create.tipo,
              fechaFin: SubscriptionsService.calcularFechaFin(createUserDto.suscripcion.create.tipo),
            },
          } : undefined,
        },
        include: {
          cuenta: true,
          rol: true,
          suscripcion: true,
        },
      });

      // Log successful user creation
      await this.userLogger.logUserAction({
        action: 'CREATE',
        entity: 'Usuario',
        entityId: String(newUser.id),
        message: `Usuario creado: ${newUser.nombre} ${newUser.apellido}`,
        metadata: {
          username: newUser.cuenta.username,
          rol: newUser.rolId,
          hasSuscripcion: !!newUser.suscripcion,
        },
        level: LogLevel.INFO,
      });

      return newUser;
    } catch (error) {
      // Log failed user creation
      await this.userLogger.logUserAction({
        action: 'CREATE_ERROR',
        entity: 'Usuario',
        message: 'Error al crear usuario',
        metadata: {
          error: error.message,
          userData: {
            nombre: createUserDto.nombre,
            apellido: createUserDto.apellido,
            username: createUserDto.cuenta.username,
          },
        },
        level: LogLevel.ERROR,
      });
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.usuario.findMany({
      include: {
        rol: true,
        suscripcion: true,
      },
    });

    await this.userLogger.logUserAction({
      action: 'READ',
      entity: 'Usuario',
      message: `Consulta de todos los usuarios`,
      metadata: {
        count: users.length,
      },
      level: LogLevel.INFO,
    });

    return users;
  }

  async findOne(id: number) {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id },
        include: {
          rol: true,
          suscripcion: true,
        },
      });

      if (!usuario) {
        await this.userLogger.logUserAction({
          action: 'READ_ERROR',
          entity: 'Usuario',
          entityId: String(id),
          message: `Usuario no encontrado`,
          level: LogLevel.WARNING,
        });
        throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
      }

      await this.userLogger.logUserAction({
        action: 'READ',
        entity: 'Usuario',
        entityId: String(id),
        message: `Consulta de usuario: ${usuario.nombre} ${usuario.apellido}`,
        level: LogLevel.INFO,
      });

      return usuario;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        await this.userLogger.logUserAction({
          action: 'READ_ERROR',
          entity: 'Usuario',
          entityId: String(id),
          message: 'Error al consultar usuario',
          metadata: { error: error.message },
          level: LogLevel.ERROR,
        });
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const data: Prisma.UsuarioUpdateInput = {
        ...(updateUserDto.nombre && { nombre: updateUserDto.nombre }),
        ...(updateUserDto.apellido && { apellido: updateUserDto.apellido }),
        ...(updateUserDto.fechaNac && {
          fechaNac: new Date(updateUserDto.fechaNac),
        }),
        ...(updateUserDto.direccion && { direccion: updateUserDto.direccion }),
        ...(updateUserDto.rolId && {
          rol: {
            connect: { id: updateUserDto.rolId },
          },
        }),
      };

      const updatedUser = await this.prisma.usuario.update({
        where: { id },
        data,
        include: {
          rol: true,
          suscripcion: true,
        },
      });

      await this.userLogger.logUserAction({
        action: 'UPDATE',
        entity: 'Usuario',
        entityId: String(id),
        message: `Usuario actualizado: ${updatedUser.nombre} ${updatedUser.apellido}`,
        metadata: {
          updatedFields: Object.keys(updateUserDto),
        },
        level: LogLevel.INFO,
      });

      return updatedUser;
    } catch (error) {
      await this.userLogger.logUserAction({
        action: 'UPDATE_ERROR',
        entity: 'Usuario',
        entityId: String(id),
        message: 'Error al actualizar usuario',
        metadata: {
          error: error.message,
          updateData: updateUserDto,
        },
        level: LogLevel.ERROR,
      });
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deletedUser = await this.prisma.usuario.delete({
        where: { id },
        include: {
          rol: true,
          suscripcion: true,
        },
      });

      await this.userLogger.logUserAction({
        action: 'DELETE',
        entity: 'Usuario',
        entityId: String(id),
        message: `Usuario eliminado: ${deletedUser.nombre} ${deletedUser.apellido}`,
        metadata: {
          rolId: deletedUser.rolId,
          hadSubscription: !!deletedUser.suscripcion,
        },
        level: LogLevel.INFO,
      });

      return deletedUser;
    } catch (error) {
      await this.userLogger.logUserAction({
        action: 'DELETE_ERROR',
        entity: 'Usuario',
        entityId: String(id),
        message: 'Error al eliminar usuario',
        metadata: { error: error.message },
        level: LogLevel.ERROR,
      });
      throw error;
    }
  }

  async updateUserPassword(correo: string, newPassword: string) {
    try {
      const hashedPassword = await this.hashPassword(newPassword);

      const updatedAccount = await this.prisma.cuenta.update({
        where: {
          correoRecuperacion: correo,
        },
        data: {
          password: hashedPassword,
        },
        include: {
          usuario: true,
        },
      });

      await this.userLogger.logUserAction({
        action: 'PASSWORD_UPDATE',
        entity: 'Cuenta',
        entityId: String(updatedAccount.id),
        message: `Contraseña actualizada para el usuario: ${updatedAccount.usuario.nombre}`,
        level: LogLevel.INFO,
      });

      return updatedAccount;
    } catch (error) {
      await this.userLogger.logUserAction({
        action: 'PASSWORD_UPDATE_ERROR',
        entity: 'Cuenta',
        message: 'Error al actualizar contraseña',
        metadata: {
          error: error.message,
          correo,
        },
        level: LogLevel.ERROR,
      });
      throw error;
    }
  }
}


