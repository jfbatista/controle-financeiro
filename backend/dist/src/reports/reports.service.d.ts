import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    dashboard(companyId: number, from?: string, to?: string): Promise<{
        totalIncomes: number;
        totalExpenses: number;
        netResult: number;
        expensesByCategory: {
            categoryId: number;
            categoryName: string;
            color: string | null | undefined;
            total: number;
        }[];
        history: {
            income: number;
            expense: number;
            date: string;
        }[];
    }>;
}
