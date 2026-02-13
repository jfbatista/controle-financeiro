import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    dashboard(companyId: number, from?: string, to?: string): Promise<{
        totalIncomes: number;
        totalExpenses: number;
        netResult: number;
        expensesByCategory: any;
        history: {
            income: number;
            expense: number;
            date: string;
        }[];
    }>;
}
