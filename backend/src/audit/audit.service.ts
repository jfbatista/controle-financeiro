import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(
        userId: number,
        companyId: number,
        action: string,
        entity: string,
        entityId: number | null,
        details?: any,
    ) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId,
                    companyId,
                    action,
                    entity,
                    entityId,
                    details: details ? JSON.stringify(details) : undefined,
                },
            });
        } catch (error) {
            console.error('Failed to create audit log:', error);
            // We don't want to fail the main transaction if logging fails, 
            // but in strict audit environments we might want to throw.
            // For now, just log the error.
        }
    }

    async findAll(companyId: number) {
        return this.prisma.auditLog.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            take: 100, // Limit for MVP
        });
    }
}
