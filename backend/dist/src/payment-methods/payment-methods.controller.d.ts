import { PaymentMethodsService } from './payment-methods.service';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
export declare class PaymentMethodsController {
    private readonly paymentMethodsService;
    constructor(paymentMethodsService: PaymentMethodsService);
    findAll(user: CurrentUserData): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }[]>;
    create(user: CurrentUserData, dto: CreatePaymentMethodDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }>;
    update(user: CurrentUserData, id: number, dto: UpdatePaymentMethodDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }>;
    remove(user: CurrentUserData, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
    }>;
}
