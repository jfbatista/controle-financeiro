import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { GroupsService } from '../groups/groups.service';

export interface JwtPayload {
  sub: number;
  email: string;
  companyId: number;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly groupsService: GroupsService,
  ) { }

  async validateUser(email: string, password: string) {
    // Include memberships to get company context
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            company: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    // Determines the context (Company/Role)
    // 1. Check memberships (UserCompany)
    // 2. Fallback to old 'companies' relation if migration failed (should not happen if migration was successful)

    let companyId: number | undefined;
    let role: string | undefined;

    if (user.memberships && user.memberships.length > 0) {
      // For MVP, select the first membership. Future: allow selecting company.
      companyId = user.memberships[0].companyId;
      role = user.memberships[0].role;
    } else {
      // Fallback logic could go here, but strictly relying on UserCompany is safer now.
      throw new UnauthorizedException('Usuário não associado a nenhuma empresa.');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      companyId: companyId!,
      role: role!,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: (this.configService.get('JWT_EXPIRES_IN') ?? '900') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
      expiresIn: (this.configService.get('REFRESH_JWT_EXPIRES_IN') ??
        '604800') as any,
    });

    const permissions = await this.groupsService.getUserPermissions(user.id, companyId!);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyId: companyId,
        permissions,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        },
      );

      const payload: JwtPayload = {
        sub: decoded.sub,
        email: decoded.email,
        companyId: decoded.companyId,
        role: decoded.role,
      };

      const accessToken = await this.jwtService.signAsync(
        payload,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: (this.configService.get('JWT_EXPIRES_IN') ?? '900') as any,
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}

