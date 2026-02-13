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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodsController = void 0;
const common_1 = require("@nestjs/common");
const payment_methods_service_1 = require("./payment-methods.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_1 = require("../auth/permissions");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_payment_method_dto_1 = require("./dto/create-payment-method.dto");
const update_payment_method_dto_1 = require("./dto/update-payment-method.dto");
let PaymentMethodsController = class PaymentMethodsController {
    paymentMethodsService;
    constructor(paymentMethodsService) {
        this.paymentMethodsService = paymentMethodsService;
    }
    findAll(user) {
        const allowed = [
            permissions_1.Permission.PAYMENT_METHOD_VIEW,
            permissions_1.Permission.TRANSACTION_VIEW,
            permissions_1.Permission.RECURRING_BILL_VIEW,
        ];
        const hasPermission = user.permissions.some((p) => allowed.includes(p));
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`Acesso negado: Requer uma das permissões: ${allowed.join(', ')}`);
        }
        return this.paymentMethodsService.findAll(user.companyId);
    }
    create(user, dto) {
        return this.paymentMethodsService.create(user.companyId, dto);
    }
    update(user, id, dto) {
        return this.paymentMethodsService.update(user.companyId, id, dto);
    }
    remove(user, id) {
        return this.paymentMethodsService.remove(user.companyId, id);
    }
};
exports.PaymentMethodsController = PaymentMethodsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.PAYMENT_METHOD_CREATE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_method_dto_1.CreatePaymentMethodDto]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.PAYMENT_METHOD_EDIT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_payment_method_dto_1.UpdatePaymentMethodDto]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.PAYMENT_METHOD_DELETE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "remove", null);
exports.PaymentMethodsController = PaymentMethodsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('payment-methods'),
    __metadata("design:paramtypes", [payment_methods_service_1.PaymentMethodsService])
], PaymentMethodsController);
//# sourceMappingURL=payment-methods.controller.js.map