import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(req: any, from?: string, to?: string, type?: TransactionType, categoryId?: string, paymentMethodId?: string): Promise<any>;
    export(req: any, from: string | undefined, to: string | undefined, type: TransactionType | undefined, categoryId: string | undefined, paymentMethodId: string | undefined, res: any): Promise<void>;
    create(req: any, dto: CreateTransactionDto): Promise<any>;
    update(req: any, id: number, dto: UpdateTransactionDto): Promise<any>;
    remove(req: any, id: number): Promise<any>;
}
