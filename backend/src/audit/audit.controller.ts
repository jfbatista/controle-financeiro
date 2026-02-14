import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CompanyGuard } from '../auth/company.guard'; // Removed if not found
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionsGuard) // Removed CompanyGuard for now
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @RequirePermissions(Permission.AUDIT_VIEW)
    async findAll(@Request() req) {
        return this.auditService.findAll(req.user.companyId);
    }
}
