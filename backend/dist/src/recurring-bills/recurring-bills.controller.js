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
exports.RecurringBillsController = void 0;
const common_1 = require("@nestjs/common");
const recurring_bills_service_1 = require("./recurring-bills.service");
const create_recurring_bill_dto_1 = require("./dto/create-recurring-bill.dto");
const update_recurring_bill_dto_1 = require("./dto/update-recurring-bill.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_1 = require("../auth/permissions");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let RecurringBillsController = class RecurringBillsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(user, dto) {
        return this.service.create(user.companyId, dto);
    }
    findAll(user) {
        return this.service.findAll(user.companyId);
    }
    findOne(user, id) {
        return this.service.findOne(user.companyId, id);
    }
    update(user, id, dto) {
        return this.service.update(user.companyId, id, dto);
    }
    remove(user, id) {
        return this.service.remove(user.companyId, id);
    }
};
exports.RecurringBillsController = RecurringBillsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.RECURRING_BILL_CREATE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_recurring_bill_dto_1.CreateRecurringBillDto]),
    __metadata("design:returntype", void 0)
], RecurringBillsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.RECURRING_BILL_VIEW),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecurringBillsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.RECURRING_BILL_VIEW),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], RecurringBillsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.RECURRING_BILL_EDIT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_recurring_bill_dto_1.UpdateRecurringBillDto]),
    __metadata("design:returntype", void 0)
], RecurringBillsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(permissions_1.Permission.RECURRING_BILL_DELETE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], RecurringBillsController.prototype, "remove", null);
exports.RecurringBillsController = RecurringBillsController = __decorate([
    (0, common_1.Controller)('recurring-bills'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [recurring_bills_service_1.RecurringBillsService])
], RecurringBillsController);
//# sourceMappingURL=recurring-bills.controller.js.map