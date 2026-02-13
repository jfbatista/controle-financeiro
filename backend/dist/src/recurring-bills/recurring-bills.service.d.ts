import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringBillDto } from './dto/create-recurring-bill.dto';
import { UpdateRecurringBillDto } from './dto/update-recurring-bill.dto';
export declare class RecurringBillsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateRecurringBillDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        description: string | null;
        amountExpected: import("@prisma/client/runtime/library").Decimal;
        dueDay: number;
    }>;
    findAll(companyId: number): Promise<({
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        description: string | null;
        amountExpected: import("@prisma/client/runtime/library").Decimal;
        dueDay: number;
    })[]>;
    findOne(companyId: number, id: number): Promise<{
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        description: string | null;
        amountExpected: import("@prisma/client/runtime/library").Decimal;
        dueDay: number;
    }>;
    update(companyId: number, id: number, dto: UpdateRecurringBillDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        description: string | null;
        amountExpected: import("@prisma/client/runtime/library").Decimal;
        dueDay: number;
    }>;
    remove(companyId: number, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: number;
        description: string | null;
        amountExpected: import("@prisma/client/runtime/library").Decimal;
        dueDay: number;
    }>;
}
