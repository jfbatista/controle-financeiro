import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyForUser(userId: number) {
    const company = await this.prisma.company.findFirst({
      where: { ownerUserId: userId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada para o usuário');
    }

    return company;
  }

  async updateCompanyForUser(userId: number, dto: UpdateCompanyDto) {
    const company = await this.getCompanyForUser(userId);

    const updated = await this.prisma.company.update({
      where: { id: company.id },
      data: {
        name: dto.name ?? company.name,
        document: dto.document ?? company.document,
        contactEmail: dto.contactEmail ?? company.contactEmail,
      },
    });

    return updated;
  }
}

