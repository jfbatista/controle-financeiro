import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: number) {
    return this.prisma.paymentMethod.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

  async create(companyId: number, dto: CreatePaymentMethodDto) {
    return this.prisma.paymentMethod.create({
      data: {
        companyId,
        name: dto.name,
      },
    });
  }

  async update(companyId: number, id: number, dto: UpdatePaymentMethodDto) {
    const pm = await this.prisma.paymentMethod.findFirst({
      where: { id, companyId },
    });
    if (!pm) {
      throw new NotFoundException('Forma de pagamento não encontrada');
    }
    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        name: dto.name ?? pm.name,
      },
    });
  }

  async remove(companyId: number, id: number) {
    const pm = await this.prisma.paymentMethod.findFirst({
      where: { id, companyId },
    });
    if (!pm) {
      throw new NotFoundException('Forma de pagamento não encontrada');
    }
    // não tem flag de ativo no schema, por enquanto apagamos físico
    return this.prisma.paymentMethod.delete({
      where: { id },
    });
  }
}

