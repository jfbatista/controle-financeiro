import { Module } from '@nestjs/common';
import { RecurringBillsService } from './recurring-bills.service';
import { RecurringBillsController } from './recurring-bills.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [RecurringBillsController],
    providers: [RecurringBillsService],
})
export class RecurringBillsModule { }
