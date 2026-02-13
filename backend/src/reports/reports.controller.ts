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
}

