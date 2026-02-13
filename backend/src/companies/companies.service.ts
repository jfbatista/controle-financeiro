import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) { }

  async getCompanyForUser(userId: number) {
    // Find the user's company through their membership
    const userCompany = await this.prisma.userCompany.findFirst({
      where: { userId },
      include: { company: true },
    });

    if (!userCompany || !userCompany.company) {
      throw new NotFoundException('Empresa não encontrada para o usuário');
    }

    return userCompany.company;
  }

  async updateCompanyForUser(userId: number, dto: UpdateCompanyDto) {
    const company = await this.getCompanyForUser(userId);

    const updated = await this.prisma.company.update({
      where: { id: company.id },
      data: {
        name: dto.name ?? company.name,
        document: dto.document ?? company.document,
        contactEmail: dto.contactEmail ?? company.contactEmail,
        smtpHost: dto.smtpHost ?? company.smtpHost,
        smtpPort: dto.smtpPort !== undefined ? Number(dto.smtpPort) : company.smtpPort,
        smtpUser: dto.smtpUser ?? company.smtpUser,
        smtpPass: dto.smtpPass ?? company.smtpPass, // TODO: encrypt?
        smtpSecure: dto.smtpSecure ?? company.smtpSecure,
        smtpFrom: dto.smtpFrom ?? company.smtpFrom,
      },
    });

    return updated;
  }
}

