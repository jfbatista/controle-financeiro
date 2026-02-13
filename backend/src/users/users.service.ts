import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async createFirstUser(dto: CreateUserDto) {
    const count = await this.prisma.user.count();
    if (count > 0) {
      throw new Error('Já existem usuários cadastrados.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    // Transaction: Create User -> Create Company -> Link User as Owner in Company -> Link User in UserCompany (Role=OWNER)
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash: hash,
        },
      });

      const company = await tx.company.create({
        data: {
          name: dto.companyName || 'Minha Empresa',
          ownerUserId: user.id,
        },
      });

      // Add to UserCompany table as OWNER
      await tx.userCompany.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: Role.OWNER,
        },
      });

      return { user, company };
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            company: true
          }
        }
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // --- Multi-user Management ---

  async findAllByCompany(companyId: number) {
    return this.prisma.userCompany.findMany({
      where: { companyId },
      include: {
        group: {
          select: { id: true, name: true }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          }
        }
      }
    });
  }

  async addUserToCompany(companyId: number, dto: { name: string; email: string; role?: Role; groupId?: number; password?: string }) {
    // Check if user already exists
    let user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      // Create user with provided password or default "123456"
      const passwordToHash = dto.password || '123456';
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(passwordToHash, salt);
      user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash: hash,
        }
      });
    }

    // Check if already member
    const existingMember = await this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId: user.id,
          companyId,
        }
      }
    });

    if (existingMember) {
      throw new Error('Usuário já é membro desta empresa.');
    }

    // Determine groupId:
    // 1. dto.groupId
    // 2. Map dto.role to a group (for backward compatibility if frontend sends role)
    // 3. Default to Viewer group

    let targetGroupId = dto.groupId;

    if (!targetGroupId && dto.role) {
      // Try to find a group matching the role name
      const roleNameMap: Record<string, string> = {
        'OWNER': 'Owner',
        'ADMIN': 'Admin',
        'EDITOR': 'Editor',
        'VIEWER': 'Viewer',
      };
      const groupName = roleNameMap[dto.role] || 'Viewer';
      const group = await this.prisma.group.findFirst({
        where: { companyId, name: groupName }
      });
      if (group) targetGroupId = group.id;
    }

    if (!targetGroupId) {
      // Find default viewer group
      const group = await this.prisma.group.findFirst({
        where: { companyId, name: 'Viewer' }
      });
      /* 
         If no viewer group usage found, we might need to create defaults.
         We can reuse GroupsService here if we inject it, or just fail/fallback.
         For now, let's assume defaults exist or fall back to role=VIEWER (legacy)
      */
      if (group) targetGroupId = group.id;
    }

    return this.prisma.userCompany.create({
      data: {
        userId: user.id,
        companyId,
        role: dto.role || Role.VIEWER, // Keep role for safety/legacy
        groupId: targetGroupId,
      }
    });
  }

  async removeUserFromCompany(companyId: number, userId: number) {
    return this.prisma.userCompany.delete({
      where: {
        userId_companyId: {
          userId,
          companyId,
        }
      }
    });
  }

  async updateUserGroup(companyId: number, userId: number, groupId: number) {
    return this.prisma.userCompany.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        }
      },
      data: { groupId }
    });
  }
}
