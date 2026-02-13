import { ReportsService } from './reports.service';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    dashboard(user: CurrentUserData, from?: string, to?: string): Promise<{
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
