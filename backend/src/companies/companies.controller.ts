import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Get('me')
  @RequirePermissions(Permission.COMPANY_MANAGE)
  getMyCompany(@CurrentUser() user: CurrentUserData) {
    return this.companiesService.getCompanyForUser(user.userId);
  }

  @Put('me')
  @RequirePermissions(Permission.COMPANY_MANAGE)
  updateMyCompany(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompanyForUser(user.userId, dto);
  }
}

