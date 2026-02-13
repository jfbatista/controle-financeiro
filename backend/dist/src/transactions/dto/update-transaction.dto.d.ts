import { TransactionType } from '@prisma/client';
export declare class UpdateTransactionDto {
    type?: TransactionType;
    categoryId?: number;
    paymentMethodId?: number;
    date?: string;
    amount?: number;
    description?: string;
}
