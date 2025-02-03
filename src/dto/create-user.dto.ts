import { TipoSuscripcion } from '@prisma/client';
import { IsString, IsNotEmpty, IsDateString, IsInt, IsEnum } from 'class-validator';


export class CreateUserDto {
  @IsInt()
  @IsNotEmpty()
  rolId: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsDateString()
  fechaNac: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;
  cuenta: {
    username: string;
    password: string;
    correoRecuperacion: string;
  };
  @IsEnum(TipoSuscripcion) // Validación para que el tipo de suscripción sea uno de los valores del enum
  suscripcion?: {
    create: {
      tipo: TipoSuscripcion;
    }
  };

}
// create-user.dto.ts