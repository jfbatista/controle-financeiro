import { TransactionType } from '@prisma/client';
export declare class UpdateRecurringBillDto {
    type?: TransactionType;
    categoryId?: number;
    amountExpected?: number;
    dueDay?: number;
    description?: string;
    isActive?: boolean;
}
