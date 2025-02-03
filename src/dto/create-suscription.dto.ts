import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { TipoSuscripcion } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsEnum(TipoSuscripcion)
  @IsNotEmpty()
  tipo: TipoSuscripcion;
  fechaFin: Date;
}