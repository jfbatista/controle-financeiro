import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
export declare class PaymentMethodsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }[]>;
    create(companyId: number, dto: CreatePaymentMethodDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }>;
    update(companyId: number, id: number, dto: UpdatePaymentMethodDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }>;
    remove(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }>;
}
