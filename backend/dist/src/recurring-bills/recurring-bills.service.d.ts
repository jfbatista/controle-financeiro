import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringBillDto } from './dto/create-recurring-bill.dto';
import { UpdateRecurringBillDto } from './dto/update-recurring-bill.dto';
export declare class RecurringBillsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(companyId: number, dto: CreateRecurringBillDto): Promise<any>;
    findAll(companyId: number): Promise<any>;
    findOne(companyId: number, id: number): Promise<any>;
    update(companyId: number, id: number, dto: UpdateRecurringBillDto): Promise<any>;
    remove(companyId: number, id: number): Promise<any>;
}
