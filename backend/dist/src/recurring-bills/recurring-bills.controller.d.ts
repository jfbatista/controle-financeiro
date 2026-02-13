import { RecurringBillsService } from './recurring-bills.service';
import { CreateRecurringBillDto } from './dto/create-recurring-bill.dto';
import { UpdateRecurringBillDto } from './dto/update-recurring-bill.dto';
export declare class RecurringBillsController {
    private readonly service;
    constructor(service: RecurringBillsService);
    create(user: any, dto: CreateRecurringBillDto): Promise<any>;
    findAll(user: any): Promise<any>;
    findOne(user: any, id: number): Promise<any>;
    update(user: any, id: number, dto: UpdateRecurringBillDto): Promise<any>;
    remove(user: any, id: number): Promise<any>;
}
