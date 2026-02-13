import { Body, Controller, Post, Get, Delete, Patch, Param, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddUserDto } from './dto/add-user.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('first')
  createFirstUser(@Body() dto: CreateUserDto) {
    return this.usersService.createFirstUser(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions(Permission.USER_VIEW)
  findAll(@Request() req) {
    return this.usersService.findAllByCompany(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions(Permission.USER_INVITE)
  addUser(@Request() req, @Body() dto: AddUserDto) {
    return this.usersService.addUserToCompany(req.user.companyId, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  @RequirePermissions(Permission.USER_DELETE)
  removeUser(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeUserFromCompany(req.user.companyId, id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch(':id/group')
  @RequirePermissions(Permission.USER_EDIT)
  updateUserGroup(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() body: { groupId: number }) {
    return this.usersService.updateUserGroup(req.user.companyId, id, body.groupId);
  }
}

