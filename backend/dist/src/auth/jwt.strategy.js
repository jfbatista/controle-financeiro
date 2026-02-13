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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const groups_service_1 = require("../groups/groups.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    groupsService;
    constructor(configService, prisma, groupsService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.prisma = prisma;
        this.groupsService = groupsService;
    }
    async validate(payload) {
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
            return null;
        }
        let permissions = [];
        if (!userCompany.groupId && userCompany.role) {
            await this.groupsService.ensureDefaultGroups(payload.companyId);
            const roleNameMap = {
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
        }
        else if (userCompany.group) {
            permissions = userCompany.group.permissions.map(p => p.permission);
        }
        return {
            userId: payload.sub,
            email: payload.email,
            companyId: payload.companyId,
            permissions,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, prisma_service_1.PrismaService,
        groups_service_1.GroupsService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map