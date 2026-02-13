import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) { }

  @Get()
  findAll(@CurrentUser() user: CurrentUserData) {
    const allowed = [
      Permission.PAYMENT_METHOD_VIEW,
      Permission.TRANSACTION_VIEW,
      Permission.RECURRING_BILL_VIEW,
    ] as string[];

    const hasPermission = user.permissions.some((p) => allowed.includes(p));
    if (!hasPermission) {
      throw new ForbiddenException(`Acesso negado: Requer uma das permissões: ${allowed.join(', ')}`);
    }

    return this.paymentMethodsService.findAll(user.companyId);
  }

  @Post()
  @RequirePermissions(Permission.PAYMENT_METHOD_CREATE)
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.create(user.companyId, dto);
  }

  @Put(':id')
  @RequirePermissions(Permission.PAYMENT_METHOD_EDIT)
  update(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(user.companyId, id, dto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.PAYMENT_METHOD_DELETE)
  remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentMethodsService.remove(user.companyId, id);
  }
}

