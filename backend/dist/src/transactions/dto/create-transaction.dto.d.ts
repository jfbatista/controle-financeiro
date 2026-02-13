import { TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    type: TransactionType;
    categoryId: number;
    paymentMethodId: number;
    date: string;
    amount: number;
    description?: string;
}
