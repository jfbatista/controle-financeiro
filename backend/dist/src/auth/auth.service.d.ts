import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { GroupsService } from '../groups/groups.service';
export interface JwtPayload {
    sub: number;
    email: string;
    companyId: number;
    role: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly groupsService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, groupsService: GroupsService);
    validateUser(email: string, password: string): Promise<{
        memberships: ({
            company: {
                id: number;
                name: string;
                document: string | null;
                contactEmail: string | null;
                ownerUserId: number;
                createdAt: Date;
                updatedAt: Date;
                smtpHost: string | null;
                smtpPort: number | null;
                smtpUser: string | null;
                smtpPass: string | null;
                smtpSecure: boolean;
                smtpFrom: string | null;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            companyId: number;
            role: import("@prisma/client").$Enums.Role;
            groupId: number | null;
        })[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        isActive: boolean;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            companyId: number;
            permissions: string[];
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
