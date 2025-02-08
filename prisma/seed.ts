import { PrismaClient, TipoSuscripcion} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const saltRounds = 10;

  try {
    // Crear rol
    const adminRol = await prisma.rol.create({
      data: {
        nombre: 'ADMIN',
        descripcion: 'Administrador del sistema',
      },
    });

    // Crear usuario con cuenta
    const usuario = await prisma.usuario.create({
      data: {
        nombre: 'Admin',
        apellido: 'Sistema',
        fechaNac: new Date('1990-01-01'),
        direccion: 'Dirección Principal',
        rolId: adminRol.id,
        cuenta: {
          create: {
            username: 'admin',
            password: await bcrypt.hash('admin123', saltRounds),
            correoRecuperacion: 'admin@example.com',
          },
        },
        suscripcion: {
          create: {
            fechaCreacion: new Date(),
            fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            tipo: TipoSuscripcion.MENSUAL,
          },
        },
      },
    });

    console.log('Base de datos sembrada exitosamente.');
    console.log('Usuario creado:', usuario);
  } catch (error) {
    console.error('Error durante la siembra de la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed()