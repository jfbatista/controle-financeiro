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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Security: do not reveal if user exists
      return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };
    }

    // Generate random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour validity

    await this.prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Try to find the user's company to get SMTP settings
    const userWithCompany = await this.prisma.user.findUnique({
      where: { email },
      include: {
        companies: true,
        memberships: { include: { company: true } }
      }
    });

    let smtpConfig: any = null;
    let fromEmail = 'noreply@fluxocaixa.com.br';

    if (userWithCompany?.companies?.[0]?.smtpHost) {
      const c = userWithCompany.companies[0];
      smtpConfig = {
        host: c.smtpHost,
        port: c.smtpPort,
        secure: c.smtpSecure,
        auth: {
          user: c.smtpUser,
          pass: c.smtpPass,
        },
      };
      fromEmail = c.smtpFrom || fromEmail;
    } else if (userWithCompany?.memberships?.[0]?.company?.smtpHost) {
      const c = userWithCompany.memberships[0].company;
      smtpConfig = {
        host: c.smtpHost,
        port: c.smtpPort,
        secure: c.smtpSecure,
        auth: {
          user: c.smtpUser,
          pass: c.smtpPass,
        },
      };
      fromEmail = c.smtpFrom || fromEmail;
    }

    if (smtpConfig && smtpConfig.host) {
      try {
        console.log('[SMTP] Attempting to send email with config:', { host: smtpConfig.host, port: smtpConfig.port, secure: smtpConfig.secure, from: fromEmail });
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport(smtpConfig);
        await transporter.sendMail({
          from: fromEmail,
          to: email,
          subject: 'Recuperação de Senha - Fluxo de Caixa',
          html: `<p>Olá,</p><p>Recebemos uma solicitação para redefinir sua senha.</p><p>Clique <a href="${resetLink}">aqui</a> para criar uma nova senha.</p><p>Link: ${resetLink}</p><p>Se você não solicitou, ignore este e-mail.</p>`,
        });
        console.log(`[SMTP EMAIL SENT] To: ${email}`);
      } catch (error) {
        console.error('[SMTP ERROR]', error);
        console.log(`[FALLBACK MOCK EMAIL] Password Reset Link: ${resetLink}`);
      }
    } else {
      console.log('[SMTP] No SMTP config found. SMTP config:', smtpConfig);
      console.log(`[MOCK EMAIL] Password Reset Link for ${email}: ${resetLink}`);
    }

    return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    if (resetToken.used || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    const user = await this.prisma.user.findUnique({ where: { email: resetToken.email } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return { message: 'Senha redefinida com sucesso!' };
  }
}
