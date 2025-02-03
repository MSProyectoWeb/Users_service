import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from '../dto/create-suscription.dto';
import { TipoSuscripcion } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
 
  constructor(private prisma: PrismaService) {}

  create(createSubscriptionDto: CreateSubscriptionDto & { fechaFin: Date }) {
    return this.prisma.suscripcion.create({
      data: {
        usuarioId: createSubscriptionDto.usuarioId,
        tipo: createSubscriptionDto.tipo,
        fechaFin: SubscriptionsService.calcularFechaFin(createSubscriptionDto.tipo),
      },
    });
  }

  findAll() {
    return this.prisma.suscripcion.findMany({
      include: {
        usuario: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.suscripcion.findUnique({
      where: { id },
      include: {
        usuario: true,
      },
    });
  }

  findByUserId(usuarioId: number) {
    return this.prisma.suscripcion.findUnique({
      where: { usuarioId },
      include: {
        usuario: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.suscripcion.delete({
      where: { id },
    });
  }

  async renovar(tipoSuscripcion: TipoSuscripcion, id: number) {
    const suscripcion = await this.findOne(id);
    if (!suscripcion) {
      throw new Error(`La suscripción con id ${id} no existe.`);
    }

    const nuevaFechaFin = SubscriptionsService.calcularFechaFin(tipoSuscripcion);
    return this.prisma.suscripcion.update({
      where: { id },
      data: {
        tipo: tipoSuscripcion,
        fechaFin: nuevaFechaFin,
      },
    });
  }

  public static calcularFechaFin(
    tipoSuscripcion: TipoSuscripcion,
    fechaInicio: Date = new Date(),
  ): Date {
    const fechaFin = new Date(fechaInicio);

    switch (tipoSuscripcion) {
      case TipoSuscripcion.SEMANAL:
        fechaFin.setDate(fechaFin.getDate() + 7);
        break;
      case TipoSuscripcion.MENSUAL:
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        break;
      case TipoSuscripcion.TRIMESTRAL:
        fechaFin.setMonth(fechaFin.getMonth() + 3);
        break;
      case TipoSuscripcion.SEMESTRAL:
        fechaFin.setMonth(fechaFin.getMonth() + 6);
        break;
      case TipoSuscripcion.ANUAL:
        fechaFin.setFullYear(fechaFin.getFullYear() + 1);
        break;
      default:
        throw new Error(
          `Tipo de suscripción "${tipoSuscripcion}" no es válido.`
        );
    }
  
    return fechaFin;
}
}

