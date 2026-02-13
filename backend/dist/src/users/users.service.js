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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFirstUser(dto) {
        const count = await this.prisma.user.count();
        if (count > 0) {
            throw new Error('Já existem usuários cadastrados.');
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(dto.password, salt);
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
            await tx.userCompany.create({
                data: {
                    userId: user.id,
                    companyId: company.id,
                    role: client_1.Role.OWNER,
                },
            });
            return { user, company };
        });
    }
    async findByEmail(email) {
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
    async findById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findAllByCompany(companyId) {
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
    async addUserToCompany(companyId, dto) {
        let user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
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
        let targetGroupId = dto.groupId;
        if (!targetGroupId && dto.role) {
            const roleNameMap = {
                'OWNER': 'Owner',
                'ADMIN': 'Admin',
                'EDITOR': 'Editor',
                'VIEWER': 'Viewer',
            };
            const groupName = roleNameMap[dto.role] || 'Viewer';
            const group = await this.prisma.group.findFirst({
                where: { companyId, name: groupName }
            });
            if (group)
                targetGroupId = group.id;
        }
        if (!targetGroupId) {
            const group = await this.prisma.group.findFirst({
                where: { companyId, name: 'Viewer' }
            });
            if (group)
                targetGroupId = group.id;
        }
        return this.prisma.userCompany.create({
            data: {
                userId: user.id,
                companyId,
                role: dto.role || client_1.Role.VIEWER,
                groupId: targetGroupId,
            }
        });
    }
    async removeUserFromCompany(companyId, userId) {
        return this.prisma.userCompany.delete({
            where: {
                userId_companyId: {
                    userId,
                    companyId,
                }
            }
        });
    }
    async updateUserGroup(companyId, userId, groupId) {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map