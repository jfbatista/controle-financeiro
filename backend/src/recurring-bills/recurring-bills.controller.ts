import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { RecurringBillsService } from './recurring-bills.service';
import { CreateRecurringBillDto } from './dto/create-recurring-bill.dto';
import { UpdateRecurringBillDto } from './dto/update-recurring-bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('recurring-bills')
@UseGuards(JwtAuthGuard)
export class RecurringBillsController {
    constructor(private readonly service: RecurringBillsService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() dto: CreateRecurringBillDto) {
        return this.service.create(user.companyId, dto);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.service.findAll(user.companyId);
    }

    @Get(':id')
    findOne(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(user.companyId, id);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRecurringBillDto,
    ) {
        return this.service.update(user.companyId, id, dto);
    }

    @Delete(':id')
    remove(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
        return this.service.remove(user.companyId, id);
    }
}
