"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const permissions_1 = require("../auth/permissions");
const client_1 = require("@prisma/client");
let GroupsService = class GroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, name, permissions) {
        return this.prisma.group.create({
            data: {
                companyId,
                name,
                permissions: {
                    create: permissions.map((p) => ({ permission: p })),
                },
            },
            include: { permissions: true },
        });
    }
    async findAll(companyId) {
        return this.prisma.group.findMany({
            where: { companyId },
            include: { permissions: true },
        });
    }
    async findOne(id) {
        return this.prisma.group.findUnique({
            where: { id },
            include: { permissions: true },
        });
    }
    async update(id, name, permissions) {
        try {
            console.log(`GroupsService.update calling transaction for id=${id}`);
            return await this.prisma.$transaction(async (tx) => {
                await tx.group.update({
                    where: { id },
                    data: { name },
                });
                await tx.groupPermission.deleteMany({
                    where: { groupId: id },
                });
                if (permissions && permissions.length > 0) {
                    await tx.groupPermission.createMany({
                        data: permissions.map((p) => ({
                            groupId: id,
                            permission: p,
                        })),
                    });
                }
                return tx.group.findUnique({
                    where: { id },
                    include: { permissions: true },
                });
            });
        }
        catch (error) {
            console.error('GroupsService.update Error:', error);
            throw error;
        }
    }
    async remove(companyId, id) {
        const group = await this.prisma.group.findFirst({
            where: { id, companyId },
        });
        if (!group) {
            throw new Error('Grupo não encontrado.');
        }
        return this.prisma.group.delete({
            where: { id },
        });
    }
    async ensureDefaultGroups(companyId) {
        const count = await this.prisma.group.count({ where: { companyId } });
        if (count > 0)
            return;
        const defaults = [
            { name: 'Admin', role: client_1.Role.ADMIN },
            { name: 'Editor', role: client_1.Role.EDITOR },
            { name: 'Viewer', role: client_1.Role.VIEWER },
            { name: 'Owner', role: client_1.Role.OWNER },
        ];
        for (const def of defaults) {
            const perms = permissions_1.RolePermissions[def.role];
            await this.create(companyId, def.name, perms);
        }
    }
    async getUserPermissions(userId, companyId) {
        console.log(`getUserPermissions: userId=${userId}, companyId=${companyId}`);
        const userCompany = await this.prisma.userCompany.findUnique({
            where: { userId_companyId: { userId, companyId } },
            include: { group: { include: { permissions: true } } }
        });
        if (!userCompany) {
            console.log('getUserPermissions: UserCompany not found');
            return [];
        }
        if (userCompany.group) {
            console.log(`getUserPermissions: Found group ${userCompany.group.name}`);
            return userCompany.group.permissions.map(p => p.permission);
        }
        console.log('getUserPermissions: Lazy Migration started', userCompany.role);
        if (userCompany.role) {
            await this.ensureDefaultGroups(companyId);
            const roleNameMap = {
                'OWNER': 'Owner',
                'ADMIN': 'Admin',
                'EDITOR': 'Editor',
                'VIEWER': 'Viewer',
            };
            const targetGroupName = roleNameMap[userCompany.role] || 'Viewer';
            console.log(`getUserPermissions: Target group ${targetGroupName}`);
            const group = await this.prisma.group.findFirst({
                where: { companyId, name: targetGroupName }
            });
            console.log(`getUserPermissions: Group found? ${group?.id}`);
            if (group) {
                console.log('getUserPermissions: Updating user group');
                await this.prisma.userCompany.update({
                    where: { userId_companyId: { userId, companyId } },
                    data: { groupId: group.id }
                });
                const groupWithPerms = await this.prisma.group.findUnique({
                    where: { id: group.id },
                    include: { permissions: true }
                });
                return groupWithPerms?.permissions.map(p => p.permission) || [];
            }
        }
        return [];
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map