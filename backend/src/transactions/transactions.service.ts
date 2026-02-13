import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

interface FindAllParams {
  companyId: number;
  from?: string;
  to?: string;
  type?: TransactionType;
  categoryId?: number;
  paymentMethodId?: number;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: FindAllParams) {
    const { companyId, from, to, type, categoryId, paymentMethodId } = params;
    return this.prisma.transaction.findMany({
      where: {
        companyId,
        type,
        categoryId,
        paymentMethodId,
        date: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      orderBy: { date: 'desc' },
      include: {
        category: true,
        paymentMethod: true,
      },
    });
  }

  async create(companyId: number, userId: number, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        companyId,
        createdByUserId: userId,
        type: dto.type,
        categoryId: dto.categoryId,
        paymentMethodId: dto.paymentMethodId,
        date: new Date(dto.date),
        amount: dto.amount,
        description: dto.description,
      },
    });
  }

  async update(
    companyId: number,
    id: number,
    dto: UpdateTransactionDto,
  ) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, companyId },
    });
    if (!existing) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    return this.prisma.transaction.update({
      where: { id },
      data: {
        type: dto.type ?? existing.type,
        categoryId: dto.categoryId ?? existing.categoryId,
        paymentMethodId: dto.paymentMethodId ?? existing.paymentMethodId,
        date: dto.date ? new Date(dto.date) : existing.date,
        amount: dto.amount ?? existing.amount,
        description: dto.description ?? existing.description,
      },
    });
  }

  async remove(companyId: number, id: number) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, companyId },
    });
    if (!existing) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}

