import { PaymentMethodsService } from './payment-methods.service';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
export declare class PaymentMethodsController {
    private readonly paymentMethodsService;
    constructor(paymentMethodsService: PaymentMethodsService);
    findAll(user: CurrentUserData): Promise<any>;
    create(user: CurrentUserData, dto: CreatePaymentMethodDto): Promise<any>;
    update(user: CurrentUserData, id: number, dto: UpdatePaymentMethodDto): Promise<any>;
    remove(user: CurrentUserData, id: number): Promise<any>;
}
