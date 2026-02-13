import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  findAll(@CurrentUser() user: CurrentUserData) {
    const allowed = [
      Permission.CATEGORY_VIEW,
      Permission.TRANSACTION_VIEW,
      Permission.RECURRING_BILL_VIEW,
    ] as string[];

    const hasPermission = user.permissions.some((p) => allowed.includes(p));
    if (!hasPermission) {
      throw new ForbiddenException(`Acesso negado: Requer uma das permissões: ${allowed.join(', ')}`);
    }

    return this.categoriesService.findAll(user.companyId);
  }

  @Post()
  @RequirePermissions(Permission.CATEGORY_CREATE)
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user.companyId, dto);
  }

  @Put(':id')
  @RequirePermissions(Permission.CATEGORY_EDIT)
  update(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(user.companyId, id, dto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.CATEGORY_DELETE)
  remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoriesService.remove(user.companyId, id);
  }
}

