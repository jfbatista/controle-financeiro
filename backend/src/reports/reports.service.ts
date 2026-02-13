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
      byCategory: byCategoryWithNames,
      transactions,
    };
  }

  /**
   * Get cash flow data (income vs expenses) for the last N months
   */
  async getCashFlowData(companyId: number, months: number = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        companyId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        type: true,
        amount: true,
      },
    });

    // Group by month
    const monthlyData = new Map<string, { income: number; expenses: number }>();

    transactions.forEach((t) => {
      const monthKey = t.date.toISOString().slice(0, 7); // "2024-02"
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }
      const data = monthlyData.get(monthKey)!;
      if (t.type === TransactionType.INCOME) {
        data.income += Number(t.amount);
      } else {
        data.expenses += Number(t.amount);
      }
    });

    // Convert to array and sort
    const result = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return result;
  }

  /**
   * Get category breakdown for current month
   */
  async getCategoryBreakdown(companyId: number, month?: string) {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const startDate = new Date(targetMonth + '-01');
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const categoryTotals = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      _sum: { amount: true },
      where: {
        companyId,
        type: TransactionType.EXPENSE,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const categories = await this.prisma.category.findMany({
      where: { companyId },
    });

    const total = categoryTotals.reduce((sum, c) => sum + Number(c._sum.amount ?? 0), 0);

    const result = categoryTotals
      .map((ct) => {
        const category = categories.find((c) => c.id === ct.categoryId);
        const value = Number(ct._sum.amount ?? 0);
        return {
          name: category?.name || 'Sem categoria',
          value,
          percentage: total > 0 ? (value / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value);

    return result;
  }

  /**
   * Get monthly comparison (current vs previous month)
   */
  async getMonthlyComparison(companyId: number) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentMonthStart);

    const [currentData, previousData] = await Promise.all([
      this.getMonthData(companyId, currentMonthStart, now),
      this.getMonthData(companyId, previousMonthStart, previousMonthEnd),
    ]);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      current: currentData,
      previous: previousData,
      changes: {
        income: calculateChange(currentData.income, previousData.income),
        expenses: calculateChange(currentData.expenses, previousData.expenses),
        net: calculateChange(currentData.net, previousData.net),
        count: calculateChange(currentData.count, previousData.count),
      },
    };
  }

  private async getMonthData(companyId: number, from: Date, to: Date) {
    const [incomes, expenses, count] = await Promise.all([
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          companyId,
          type: TransactionType.INCOME,
          date: { gte: from, lte: to },
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          companyId,
          type: TransactionType.EXPENSE,
          date: { gte: from, lte: to },
        },
      }),
      this.prisma.transaction.count({
        where: {
          companyId,
          date: { gte: from, lte: to },
        },
      }),
    ]);

    const income = Number(incomes._sum.amount ?? 0);
    const expense = Number(expenses._sum.amount ?? 0);

    return {
      income,
      expenses: expense,
      net: income - expense,
      count,
    };
  }

  /**
   * Get top transactions (expenses and income)
   */
  async getTopTransactions(companyId: number, limit: number = 5) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [topExpenses, topIncome] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          companyId,
          type: TransactionType.EXPENSE,
          date: { gte: monthStart },
        },
        include: {
          category: true,
        },
        orderBy: { amount: 'desc' },
        take: limit,
      }),
      this.prisma.transaction.findMany({
        where: {
          companyId,
          type: TransactionType.INCOME,
          date: { gte: monthStart },
        },
        include: {
          category: true,
        },
        orderBy: { amount: 'desc' },
        take: limit,
      }),
    ]);

    return {
      topExpenses: topExpenses.map((t) => ({
        description: t.description || t.category?.name || 'Sem descrição',
        amount: Number(t.amount),
        category: t.category?.name,
        date: t.date,
      })),
      topIncome: topIncome.map((t) => ({
        description: t.description || t.category?.name || 'Sem descrição',
        amount: Number(t.amount),
        category: t.category?.name,
        date: t.date,
      })),
    };
  }
}
