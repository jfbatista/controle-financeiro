import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('me')
  getMyCompany(@CurrentUser() user: CurrentUserData) {
    return this.companiesService.getCompanyForUser(user.userId);
  }

  @Put('me')
  updateMyCompany(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompanyForUser(user.userId, dto);
  }
}

