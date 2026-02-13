import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GroupsService } from '../groups/groups.service';
import { JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
    private groupsService: GroupsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload) {
    // 1. Get UserCompany to find groupId
    const userCompany = await this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId: payload.sub,
          companyId: payload.companyId,
        },
      },
      include: {
        group: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!userCompany) {
      return null; // Or throw Unauthorized
    }

    let permissions: string[] = [];

    // Lazy Migration: If no group, but has legacy Role
    if (!userCompany.groupId && userCompany.role) {
      // Ensure default groups exist for this company
      await this.groupsService.ensureDefaultGroups(payload.companyId);

      // Find group matching the role
      // Mapping legacy Role enum string to Group Name
      const roleNameMap: Record<string, string> = {
        'OWNER': 'Owner',
        'ADMIN': 'Admin',
        'EDITOR': 'Editor',
        'VIEWER': 'Viewer',
      };
      const targetGroupName = roleNameMap[userCompany.role] || 'Viewer';

      const group = await this.prisma.group.findFirst({
        where: { companyId: payload.companyId, name: targetGroupName },
        include: { permissions: true }
      });

      if (group) {
        await this.prisma.userCompany.update({
          where: { userId_companyId: { userId: payload.sub, companyId: payload.companyId } },
          data: { groupId: group.id }
        });
        permissions = group.permissions.map(p => p.permission);
      }
    } else if (userCompany.group) {
      permissions = userCompany.group.permissions.map(p => p.permission);
    }

    return {
      userId: payload.sub,
      email: payload.email,
      companyId: payload.companyId,
      permissions,
    };
  }
}

