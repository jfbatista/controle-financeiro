import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GroupsService } from '../groups/groups.service';
import { JwtPayload } from './auth.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    private groupsService;
    constructor(configService: ConfigService, prisma: PrismaService, groupsService: GroupsService);
    validate(payload: JwtPayload): Promise<{
        userId: number;
        email: string;
        companyId: number;
        permissions: string[];
    } | null>;
}
export {};
