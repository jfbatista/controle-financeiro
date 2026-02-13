import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(req: any, from?: string, to?: string, type?: TransactionType, categoryId?: string, paymentMethodId?: string): Promise<({
        category: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            isActive: boolean;
            type: import("@prisma/client").$Enums.CategoryType;
            color: string | null;
        };
        paymentMethod: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: number;
            isActive: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        paymentMethodId: number;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        createdByUserId: number;
    })[]>;
    export(req: any, from: string | undefined, to: string | undefined, type: TransactionType | undefined, categoryId: string | undefined, paymentMethodId: string | undefined, res: any): Promise<void>;
    create(req: any, dto: CreateTransactionDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        paymentMethodId: number;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        createdByUserId: number;
    }>;
    update(req: any, id: number, dto: UpdateTransactionDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        paymentMethodId: number;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        createdByUserId: number;
    }>;
    remove(req: any, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        paymentMethodId: number;
        date: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        createdByUserId: number;
    }>;
}
