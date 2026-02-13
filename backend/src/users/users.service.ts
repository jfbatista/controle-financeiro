import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createFirstUser(dto: CreateUserDto) {
    const usersCount = await this.prisma.user.count();
    if (usersCount > 0) {
      throw new BadRequestException(
        'Já existe usuário cadastrado. Use o login.',
      );
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('E-mail já está em uso');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        isActive: true,
      },
    });

    const companyName = dto.companyName ?? 'Minha Empresa';

    const company = await this.prisma.company.create({
      data: {
        name: companyName,
        ownerUserId: user.id,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      company: {
        id: company.id,
        name: company.name,
      },
    };
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }
}

