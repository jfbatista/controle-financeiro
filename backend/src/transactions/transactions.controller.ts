import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  @RequirePermissions(Permission.TRANSACTION_VIEW)
  findAll(
    @Request() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('type') type?: TransactionType,
    @Query('categoryId') categoryId?: string,
    @Query('paymentMethodId') paymentMethodId?: string,
  ) {
    return this.transactionsService.findAll({
      companyId: req.user.companyId,
      from,
      to,
      type,
      categoryId: categoryId ? Number(categoryId) : undefined,
      paymentMethodId: paymentMethodId ? Number(paymentMethodId) : undefined,
    });
  }

  @Get('export')
  @RequirePermissions(Permission.TRANSACTION_VIEW)
  async export(
    @Request() req,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @Query('type') type: TransactionType | undefined,
    @Query('categoryId') categoryId: string | undefined,
    @Query('paymentMethodId') paymentMethodId: string | undefined,
    @Res() res,
  ) {
    const buffer = await this.transactionsService.export({
      companyId: req.user.companyId,
      from,
      to,
      type,
      categoryId: categoryId ? Number(categoryId) : undefined,
      paymentMethodId: paymentMethodId ? Number(paymentMethodId) : undefined,
    });

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=lancamentos.xlsx',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Post()
  @RequirePermissions(Permission.TRANSACTION_CREATE)
  create(
    @Request() req,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req.user.userId, req.user.companyId, dto);
  }

  @Put(':id')
  @RequirePermissions(Permission.TRANSACTION_EDIT)
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(req.user.companyId, req.user.userId, id, dto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.TRANSACTION_DELETE)
  remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionsService.remove(req.user.companyId, req.user.userId, id);
  }
}

