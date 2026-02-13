import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Permission, RolePermissions } from '../auth/permissions';
import { Role } from '@prisma/client';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService) { }

    async create(companyId: number, name: string, permissions: Permission[]) {
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

    async findAll(companyId: number) {
        return this.prisma.group.findMany({
            where: { companyId },
            include: { permissions: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.group.findUnique({
            where: { id },
            include: { permissions: true },
        });
    }

    async update(id: number, name: string, permissions: Permission[]) {
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
        } catch (error) {
            console.error('GroupsService.update Error:', error);
            throw error;
        }
    }

    async remove(companyId: number, id: number) {
        // Ensure group belongs to company
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

    async ensureDefaultGroups(companyId: number) {
        const count = await this.prisma.group.count({ where: { companyId } });
        if (count > 0) return; // Already has groups

        // Create default groups based on old Roles
        const defaults = [
            { name: 'Admin', role: Role.ADMIN },
            { name: 'Editor', role: Role.EDITOR },
            { name: 'Viewer', role: Role.VIEWER },
            { name: 'Owner', role: Role.OWNER },
        ];

        for (const def of defaults) {
            const perms = RolePermissions[def.role];
            await this.create(companyId, def.name, perms);
        }
    }

    async getUserPermissions(userId: number, companyId: number): Promise<string[]> {
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
        // Lazy Migration
        if (userCompany.role) {
            await this.ensureDefaultGroups(companyId);
            const roleNameMap: Record<string, string> = {
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
                // Fetch permissions for the new group
                const groupWithPerms = await this.prisma.group.findUnique({
                    where: { id: group.id },
                    include: { permissions: true }
                });
                return groupWithPerms?.permissions.map(p => p.permission) || [];
            }
        }

        return [];
    }
}
