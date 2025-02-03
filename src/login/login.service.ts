import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(loginDto: { username: string; password: string }) {
    const { username, password } = loginDto;

    // Find user by username
    const account = await this.prisma.cuenta.findUnique({
      where: { username },
      include: { usuario: true }, // Optionally include related data
    });

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      user: account.usuario,
    };
  }
}
