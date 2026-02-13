import { RecurringBillsService } from './recurring-bills.service';
import { CreateRecurringBillDto } from './dto/create-recurring-bill.dto';
import { UpdateRecurringBillDto } from './dto/update-recurring-bill.dto';
export declare class RecurringBillsController {
    private readonly service;
    constructor(service: RecurringBillsService);
    create(user: any, dto: CreateRecurringBillDto): Promise<{
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
    findAll(user: any): Promise<({
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
    findOne(user: any, id: number): Promise<{
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
    update(user: any, id: number, dto: UpdateRecurringBillDto): Promise<{
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
    remove(user: any, id: number): Promise<{
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
