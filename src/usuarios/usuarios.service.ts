import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SubscriptionsService } from '../suscriptions/suscriptions.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(
      createUserDto.cuenta.password,
    );

    return this.prisma.usuario.create({
      data: {
        nombre: createUserDto.nombre,
        apellido: createUserDto.apellido,
        fechaNac: new Date(createUserDto.fechaNac), // Parse string to Date
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
            tipo: createUserDto.suscripcion.create.tipo, // Usando el tipo de enum
            fechaFin:SubscriptionsService.calcularFechaFin(createUserDto.suscripcion.create.tipo),
          },
        } : undefined, // Solo crea la suscripción si se ha proporcionado
      },
      include: {
        cuenta: true,
        rol: true,
        suscripcion: true,
      },
    });
  }
  findAll() {
    return this.prisma.usuario.findMany({
      include: {
        rol: true,
        suscripcion: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        rol: true,
        suscripcion: true,
      },
    });
  
    if (!usuario) { // Verificamos si usuario es null o undefined
      throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
    }
  
    return usuario; // Si el usuario existe, lo retornamos
  }
  

  async update(id: number, updateUserDto: UpdateUserDto) {
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

    return this.prisma.usuario.update({
      where: { id },
      data,
      include: {
        rol: true,
        suscripcion: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
      include: {
        rol: true,
        suscripcion: true,
      },
    });
  }
  async updateUserPassword(correo: string, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);

    return this.prisma.cuenta.update({
      where: {
        correoRecuperacion: correo,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}
