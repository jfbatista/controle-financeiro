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
    findAll(params: FindAllParams): Promise<any>;
    create(companyId: number, userId: number, dto: CreateTransactionDto): Promise<any>;
    update(companyId: number, id: number, dto: UpdateTransactionDto): Promise<any>;
    remove(companyId: number, id: number): Promise<any>;
    export(params: FindAllParams): Promise<any>;
}
export {};
