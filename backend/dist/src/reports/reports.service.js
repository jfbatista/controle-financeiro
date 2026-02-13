"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dashboard(companyId, from, to) {
        const whereBase = {
            companyId,
            date: {
                gte: from ? new Date(from) : undefined,
                lte: to ? new Date(to) : undefined,
            },
        };
        const [incomes, expenses, byCategory] = await Promise.all([
            this.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { ...whereBase, type: client_1.TransactionType.INCOME },
            }),
            this.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { ...whereBase, type: client_1.TransactionType.EXPENSE },
            }),
            this.prisma.transaction.groupBy({
                by: ['categoryId'],
                _sum: { amount: true },
                where: { ...whereBase, type: client_1.TransactionType.EXPENSE },
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
        const historyMap = new Map();
        transactions.forEach((t) => {
            const dateStr = t.date.toISOString().slice(0, 10);
            if (!historyMap.has(dateStr)) {
                historyMap.set(dateStr, { income: 0, expense: 0 });
            }
            const entry = historyMap.get(dateStr);
            const val = Number(t.amount);
            if (t.type === client_1.TransactionType.INCOME) {
                entry.income += val;
            }
            else {
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map