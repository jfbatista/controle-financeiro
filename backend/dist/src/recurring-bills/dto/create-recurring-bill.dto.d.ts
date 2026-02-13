import { TransactionType } from '@prisma/client';
export declare class CreateRecurringBillDto {
    type: TransactionType;
    categoryId: number;
    amountExpected: number;
    dueDay: number;
    description?: string;
}
