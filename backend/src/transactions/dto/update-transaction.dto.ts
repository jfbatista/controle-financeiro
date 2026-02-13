import { TransactionType } from '@prisma/client';

export class UpdateTransactionDto {
  type?: TransactionType;
  categoryId?: number;
  paymentMethodId?: number;
  date?: string;
  amount?: number;
  description?: string;
}

