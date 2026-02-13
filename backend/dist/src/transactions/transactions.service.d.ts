import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';
interface FindAllParams {
    companyId: number;
    from?: string;
    to?: string;
    type?: TransactionType;
    categoryId?: number;
    paymentMethodId?: number;
}
export declare class TransactionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(params: FindAllParams): Promise<({
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
    create(companyId: number, userId: number, dto: CreateTransactionDto): Promise<{
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
    update(companyId: number, id: number, dto: UpdateTransactionDto): Promise<{
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
    remove(companyId: number, id: number): Promise<{
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
    export(params: FindAllParams): Promise<any>;
}
export {};
