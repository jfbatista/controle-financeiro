import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
export declare class PaymentMethodsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: number): Promise<any>;
    create(companyId: number, dto: CreatePaymentMethodDto): Promise<any>;
    update(companyId: number, id: number, dto: UpdatePaymentMethodDto): Promise<any>;
    remove(companyId: number, id: number): Promise<any>;
}
