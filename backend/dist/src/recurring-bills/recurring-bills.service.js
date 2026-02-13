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
exports.RecurringBillsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RecurringBillsService = class RecurringBillsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        return this.prisma.recurringBill.create({
            data: {
                companyId,
                type: dto.type,
                categoryId: dto.categoryId,
                amountExpected: dto.amountExpected,
                dueDay: dto.dueDay,
                description: dto.description,
            },
        });
    }
    async findAll(companyId) {
        return this.prisma.recurringBill.findMany({
            where: { companyId },
            orderBy: { dueDay: 'asc' },
            include: {
                category: true,
            },
        });
    }
    async findOne(companyId, id) {
        const bill = await this.prisma.recurringBill.findFirst({
            where: { id, companyId },
            include: { category: true },
        });
        if (!bill) {
            throw new common_1.NotFoundException('Conta fixa não encontrada');
        }
        return bill;
    }
    async update(companyId, id, dto) {
        await this.findOne(companyId, id);
        return this.prisma.recurringBill.update({
            where: { id },
            data: {
                ...dto,
            },
        });
    }
    async remove(companyId, id) {
        await this.findOne(companyId, id);
        return this.prisma.recurringBill.delete({
            where: { id },
        });
    }
};
exports.RecurringBillsService = RecurringBillsService;
exports.RecurringBillsService = RecurringBillsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecurringBillsService);
//# sourceMappingURL=recurring-bills.service.js.map