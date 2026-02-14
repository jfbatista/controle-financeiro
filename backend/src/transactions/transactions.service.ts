import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

interface FindAllParams {
  companyId: number;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  type?: TransactionType;
  categoryId?: number;
  paymentMethodId?: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) { }

  async findAll(params: FindAllParams) {
    const { companyId, from, to, type, categoryId, paymentMethodId, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where = {
      companyId,
      type,
      categoryId,
      paymentMethodId,
      date: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
    };

    const [total, data] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { date: 'desc' },
        include: {
          category: true,
          paymentMethod: true,
          attachments: true,
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        lastPage: Math.ceil(total / Number(limit)),
      },
    };
  }

  async create(userId: number, companyId: number, dto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
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

    await this.auditService.log(
      userId,
      companyId,
      'CREATE',
      'Transaction',
      transaction.id,
      { amount: dto.amount, type: dto.type }
    );

    return transaction;
  }

  async update(
    companyId: number,
    userId: number,
    id: number,
    dto: UpdateTransactionDto,
  ) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, companyId },
    });
    if (!existing) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    const updated = await this.prisma.transaction.update({
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

    await this.auditService.log(
      userId,
      companyId,
      'UPDATE',
      'Transaction',
      id,
      {
        changes: dto,
        originalAmount: existing.amount,
        newAmount: updated.amount
      }
    );

    return updated;
  }

  async remove(companyId: number, userId: number, id: number) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, companyId },
    });
    if (!existing) {
      throw new NotFoundException('Lançamento não encontrado');
    }
    const deleted = await this.prisma.transaction.delete({
      where: { id },
    });

    await this.auditService.log(
      userId,
      companyId,
      'DELETE',
      'Transaction',
      id,
      { amount: existing.amount, date: existing.date, description: existing.description }
    );

    return deleted;
  }

  async export(params: FindAllParams) {
    // Re-implement query construction to fetch ALL records (no pagination)
    const { companyId, from, to, type, categoryId, paymentMethodId } = params;

    const where = {
      companyId,
      type,
      categoryId,
      paymentMethodId,
      date: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        category: true,
        paymentMethod: true,
        attachments: true,
      },
    });

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

