import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) { }

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

    const transactions = await this.prisma.transaction.findMany({
      where: whereBase,
      select: {
        date: true,
        type: true,
        amount: true,
      },
      orderBy: { date: 'asc' },
    });

    const categories = await this.prisma.category.findMany({
      where: { companyId },
    });

    const expensesByCategory = byCategory.map((row) => {
      const category = categories.find((c) => c.id === row.categoryId);
      return {
        categoryId: row.categoryId,
        categoryName: category?.name ?? 'Categoria',
        color: category?.color,
        total: Number(row._sum.amount ?? 0),
      };
    });

    // Aggregate daily history in memory
    const historyMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t) => {
      // Format date as YYYY-MM-DD
      const dateStr = t.date.toISOString().slice(0, 10);
      if (!historyMap.has(dateStr)) {
        historyMap.set(dateStr, { income: 0, expense: 0 });
      }
      const entry = historyMap.get(dateStr)!;
      const val = Number(t.amount);
      if (t.type === TransactionType.INCOME) {
        entry.income += val;
      } else {
        entry.expense += val;
      }
    });

    const history = Array.from(historyMap.entries()).map(([date, vals]) => ({
      date,
      ...vals,
    })).sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalIncomes,
      totalExpenses,
      netResult,
      expensesByCategory,
      history,
    };
  }
}

