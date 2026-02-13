import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('dashboard')
  dashboard(
    @CurrentUser() user: CurrentUserData,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.dashboard(user.companyId, from, to);
  }

  @Get('cash-flow')
  getCashFlow(
    @CurrentUser() user: CurrentUserData,
    @Query('months') months?: string,
  ) {
    const monthsNum = months ? parseInt(months, 10) : 6;
    return this.reportsService.getCashFlowData(user.companyId, monthsNum);
  }

  @Get('category-breakdown')
  getCategoryBreakdown(
    @CurrentUser() user: CurrentUserData,
    @Query('month') month?: string,
  ) {
    return this.reportsService.getCategoryBreakdown(user.companyId, month);
  }

  @Get('monthly-comparison')
  getMonthlyComparison(@CurrentUser() user: CurrentUserData) {
    return this.reportsService.getMonthlyComparison(user.companyId);
  }

  @Get('top-transactions')
  getTopTransactions(
    @CurrentUser() user: CurrentUserData,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.reportsService.getTopTransactions(user.companyId, limitNum);
  }
}

