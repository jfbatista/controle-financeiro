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
  constructor(private readonly prisma: PrismaService) { }

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

  async export(params: FindAllParams) {
    const transactions = await this.findAll(params);

    // Lazy load exceljs to avoid overhead if not used frequently
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lançamentos');

    worksheet.columns = [
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Tipo', key: 'type', width: 10 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Forma Pag.', key: 'paymentMethod', width: 20 },
      { header: 'Valor', key: 'amount', width: 15 },
      { header: 'Descrição', key: 'description', width: 30 },
    ];

    transactions.forEach(t => {
      worksheet.addRow({
        date: t.date,
        type: t.type === 'INCOME' ? 'Receita' : 'Despesa',
        category: t.category.name,
        paymentMethod: t.paymentMethod.name,
        amount: Number(t.amount),
        description: t.description,
      });
    });

    // Style header
    worksheet.getRow(1).font = { bold: true };

    return workbook.xlsx.writeBuffer();
  }
}

