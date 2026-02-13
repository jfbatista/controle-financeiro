"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const groups_service_1 = require("../groups/groups.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    groupsService;
    constructor(prisma, jwtService, configService, groupsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.groupsService = groupsService;
    }
    async validateUser(email, password) {
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
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        return user;
    }
    async login(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        let companyId;
        let role;
        if (user.memberships && user.memberships.length > 0) {
            companyId = user.memberships[0].companyId;
            role = user.memberships[0].role;
        }
        else {
            throw new common_1.UnauthorizedException('Usuário não associado a nenhuma empresa.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            companyId: companyId,
            role: role,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: (this.configService.get('JWT_EXPIRES_IN') ?? '900'),
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('REFRESH_JWT_SECRET'),
            expiresIn: (this.configService.get('REFRESH_JWT_EXPIRES_IN') ??
                '604800'),
        });
        const permissions = await this.groupsService.getUserPermissions(user.id, companyId);
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
    async refresh(refreshToken) {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('REFRESH_JWT_SECRET'),
            });
            const payload = {
                sub: decoded.sub,
                email: decoded.email,
                companyId: decoded.companyId,
                role: decoded.role,
            };
            const accessToken = await this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: (this.configService.get('JWT_EXPIRES_IN') ?? '900'),
            });
            return { accessToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido ou expirado');
        }
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };
        }
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await this.prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expiresAt,
            },
        });
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        const userWithCompany = await this.prisma.user.findUnique({
            where: { email },
            include: {
                companies: true,
                memberships: { include: { company: true } }
            }
        });
        let smtpConfig = null;
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
        }
        else if (userWithCompany?.memberships?.[0]?.company?.smtpHost) {
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
            }
            catch (error) {
                console.error('[SMTP ERROR]', error);
                console.log(`[FALLBACK MOCK EMAIL] Password Reset Link: ${resetLink}`);
            }
        }
        else {
            console.log('[SMTP] No SMTP config found. SMTP config:', smtpConfig);
            console.log(`[MOCK EMAIL] Password Reset Link for ${email}: ${resetLink}`);
        }
        return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };
    }
    async resetPassword(token, newPassword) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!resetToken) {
            throw new common_1.UnauthorizedException('Token inválido ou expirado.');
        }
        if (resetToken.used || resetToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Token inválido ou expirado.');
        }
        const user = await this.prisma.user.findUnique({ where: { email: resetToken.email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não encontrado.');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService, typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, groups_service_1.GroupsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map