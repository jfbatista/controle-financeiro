import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringBillDto } from './dto/create-recurring-bill.dto';
import { UpdateRecurringBillDto } from './dto/update-recurring-bill.dto';

@Injectable()
export class RecurringBillsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(companyId: number, dto: CreateRecurringBillDto) {
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

    async findAll(companyId: number) {
        return this.prisma.recurringBill.findMany({
            where: { companyId },
            orderBy: { dueDay: 'asc' },
            include: {
                category: true,
            },
        });
    }

    async findOne(companyId: number, id: number) {
        const bill = await this.prisma.recurringBill.findFirst({
            where: { id, companyId },
            include: { category: true },
        });

        if (!bill) {
            throw new NotFoundException('Conta fixa não encontrada');
        }

        return bill;
    }

    async update(companyId: number, id: number, dto: UpdateRecurringBillDto) {
        await this.findOne(companyId, id); // Ensure it exists and belongs to company

        return this.prisma.recurringBill.update({
            where: { id },
            data: {
                ...dto,
            },
        });
    }

    async remove(companyId: number, id: number) {
        await this.findOne(companyId, id); // Ensure it exists and belongs to company

        return this.prisma.recurringBill.delete({
            where: { id },
        });
    }
}
