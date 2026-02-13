import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Get()
    @RequirePermissions(Permission.USER_VIEW)
    findAll(@CurrentUser() user: CurrentUserData) {
        return this.groupsService.findAll(user.companyId);
    }

    @Post()
    @RequirePermissions(Permission.USER_INVITE)
    create(
        @CurrentUser() user: CurrentUserData,
        @Body() body: { name: string; permissions: Permission[] },
    ) {
        return this.groupsService.create(user.companyId, body.name, body.permissions);
    }

    @Put(':id')
    @RequirePermissions(Permission.USER_EDIT)
    update(
        @CurrentUser() user: CurrentUserData,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { name: string; permissions: Permission[] },
    ) {
        return this.groupsService.update(id, body.name, body.permissions);
    }

    @Delete(':id')
    @RequirePermissions(Permission.USER_DELETE)
    remove(
        @CurrentUser() user: CurrentUserData,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.groupsService.remove(user.companyId, id);
    }
}
