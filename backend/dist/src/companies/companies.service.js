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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompaniesService = class CompaniesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCompanyForUser(userId) {
        const userCompany = await this.prisma.userCompany.findFirst({
            where: { userId },
            include: { company: true },
        });
        if (!userCompany || !userCompany.company) {
            throw new common_1.NotFoundException('Empresa não encontrada para o usuário');
        }
        return userCompany.company;
    }
    async updateCompanyForUser(userId, dto) {
        const company = await this.getCompanyForUser(userId);
        const updated = await this.prisma.company.update({
            where: { id: company.id },
            data: {
                name: dto.name ?? company.name,
                document: dto.document ?? company.document,
                contactEmail: dto.contactEmail ?? company.contactEmail,
                smtpHost: dto.smtpHost ?? company.smtpHost,
                smtpPort: dto.smtpPort !== undefined ? Number(dto.smtpPort) : company.smtpPort,
                smtpUser: dto.smtpUser ?? company.smtpUser,
                smtpPass: dto.smtpPass ?? company.smtpPass,
                smtpSecure: dto.smtpSecure ?? company.smtpSecure,
                smtpFrom: dto.smtpFrom ?? company.smtpFrom,
            },
        });
        return updated;
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map