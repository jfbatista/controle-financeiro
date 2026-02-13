import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(companyId: number, from?: string, to?: string) {
    const whereBase: any = {
      companyId,
      date: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
    };

    const [incomes, expenses, byCategory] = await Promise.all([
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { ...whereBase, type: TransactionType.INCOME },
      }),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { ...whereBase, type: TransactionType.EXPENSE },
      }),
      this.prisma.transaction.groupBy({
        by: ['categoryId'],
        _sum: { amount: true },
        where: { ...whereBase, type: TransactionType.EXPENSE },
      }),
    ]);

    const totalIncomes = Number(incomes._sum.amount ?? 0);
    const totalExpenses = Number(expenses._sum.amount ?? 0);
    const netResult = totalIncomes - totalExpenses;

    const categories = await this.prisma.category.findMany({
      where: { companyId },
    });

    const expensesByCategory = byCategory.map((row) => {
      const category = categories.find((c) => c.id === row.categoryId);
      return {
        categoryId: row.categoryId,
        categoryName: category?.name ?? 'Categoria',
        total: Number(row._sum.amount ?? 0),
      };
    });

    return {
      totalIncomes,
      totalExpenses,
      netResult,
      expensesByCategory,
    };
  }
}

