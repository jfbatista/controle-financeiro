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
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('recurring-bills')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecurringBillsController {
    constructor(private readonly service: RecurringBillsService) { }

    @Post()
    @RequirePermissions(Permission.RECURRING_BILL_CREATE)
    create(@CurrentUser() user: any, @Body() dto: CreateRecurringBillDto) {
        return this.service.create(user.companyId, dto);
    }

    @Get()
    @RequirePermissions(Permission.RECURRING_BILL_VIEW)
    findAll(@CurrentUser() user: any) {
        return this.service.findAll(user.companyId);
    }

    @Get(':id')
    @RequirePermissions(Permission.RECURRING_BILL_VIEW)
    findOne(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(user.companyId, id);
    }

    @Patch(':id')
    @RequirePermissions(Permission.RECURRING_BILL_EDIT)
    update(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRecurringBillDto,
    ) {
        return this.service.update(user.companyId, id, dto);
    }

    @Delete(':id')
    @RequirePermissions(Permission.RECURRING_BILL_DELETE)
    remove(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
        return this.service.remove(user.companyId, id);
    }
}
