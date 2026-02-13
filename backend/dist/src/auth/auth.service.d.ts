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
    validateUser(email: string, password: string): Promise<any>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            companyId: number | undefined;
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
