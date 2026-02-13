"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.Permission = void 0;
var Permission;
(function (Permission) {
    Permission["TRANSACTION_VIEW"] = "TRANSACTION_VIEW";
    Permission["TRANSACTION_CREATE"] = "TRANSACTION_CREATE";
    Permission["TRANSACTION_EDIT"] = "TRANSACTION_EDIT";
    Permission["TRANSACTION_DELETE"] = "TRANSACTION_DELETE";
    Permission["USER_VIEW"] = "USER_VIEW";
    Permission["USER_INVITE"] = "USER_INVITE";
    Permission["USER_EDIT"] = "USER_EDIT";
    Permission["USER_DELETE"] = "USER_DELETE";
    Permission["REPORT_VIEW"] = "REPORT_VIEW";
    Permission["SETTINGS_MANAGE"] = "SETTINGS_MANAGE";
    Permission["CATEGORY_VIEW"] = "CATEGORY_VIEW";
    Permission["CATEGORY_CREATE"] = "CATEGORY_CREATE";
    Permission["CATEGORY_EDIT"] = "CATEGORY_EDIT";
    Permission["CATEGORY_DELETE"] = "CATEGORY_DELETE";
    Permission["PAYMENT_METHOD_VIEW"] = "PAYMENT_METHOD_VIEW";
    Permission["PAYMENT_METHOD_CREATE"] = "PAYMENT_METHOD_CREATE";
    Permission["PAYMENT_METHOD_EDIT"] = "PAYMENT_METHOD_EDIT";
    Permission["PAYMENT_METHOD_DELETE"] = "PAYMENT_METHOD_DELETE";
    Permission["RECURRING_BILL_VIEW"] = "RECURRING_BILL_VIEW";
    Permission["RECURRING_BILL_CREATE"] = "RECURRING_BILL_CREATE";
    Permission["RECURRING_BILL_EDIT"] = "RECURRING_BILL_EDIT";
    Permission["RECURRING_BILL_DELETE"] = "RECURRING_BILL_DELETE";
    Permission["COMPANY_MANAGE"] = "COMPANY_MANAGE";
})(Permission || (exports.Permission = Permission = {}));
exports.RolePermissions = {
    OWNER: [
        Permission.TRANSACTION_VIEW,
        Permission.TRANSACTION_CREATE,
        Permission.TRANSACTION_EDIT,
        Permission.TRANSACTION_DELETE,
        Permission.USER_VIEW,
        Permission.USER_INVITE,
        Permission.USER_EDIT,
        Permission.USER_DELETE,
        Permission.REPORT_VIEW,
        Permission.SETTINGS_MANAGE,
        Permission.COMPANY_MANAGE,
        Permission.CATEGORY_VIEW,
        Permission.CATEGORY_CREATE,
        Permission.CATEGORY_EDIT,
        Permission.CATEGORY_DELETE,
        Permission.PAYMENT_METHOD_VIEW,
        Permission.PAYMENT_METHOD_CREATE,
        Permission.PAYMENT_METHOD_EDIT,
        Permission.PAYMENT_METHOD_DELETE,
        Permission.RECURRING_BILL_VIEW,
        Permission.RECURRING_BILL_CREATE,
        Permission.RECURRING_BILL_EDIT,
        Permission.RECURRING_BILL_DELETE,
    ],
    ADMIN: [
        Permission.TRANSACTION_VIEW,
        Permission.TRANSACTION_CREATE,
        Permission.TRANSACTION_EDIT,
        Permission.TRANSACTION_DELETE,
        Permission.USER_VIEW,
        Permission.USER_INVITE,
        Permission.USER_EDIT,
        Permission.USER_DELETE,
        Permission.REPORT_VIEW,
        Permission.SETTINGS_MANAGE,
        Permission.COMPANY_MANAGE,
        Permission.CATEGORY_VIEW,
        Permission.CATEGORY_CREATE,
        Permission.CATEGORY_EDIT,
        Permission.CATEGORY_DELETE,
        Permission.PAYMENT_METHOD_VIEW,
        Permission.PAYMENT_METHOD_CREATE,
        Permission.PAYMENT_METHOD_EDIT,
        Permission.PAYMENT_METHOD_DELETE,
        Permission.RECURRING_BILL_VIEW,
        Permission.RECURRING_BILL_CREATE,
        Permission.RECURRING_BILL_EDIT,
        Permission.RECURRING_BILL_DELETE,
    ],
    EDITOR: [
        Permission.TRANSACTION_VIEW,
        Permission.TRANSACTION_CREATE,
        Permission.TRANSACTION_EDIT,
        Permission.REPORT_VIEW,
        Permission.SETTINGS_MANAGE,
        Permission.CATEGORY_VIEW,
        Permission.CATEGORY_CREATE,
        Permission.CATEGORY_EDIT,
        Permission.PAYMENT_METHOD_VIEW,
        Permission.PAYMENT_METHOD_CREATE,
        Permission.PAYMENT_METHOD_EDIT,
        Permission.RECURRING_BILL_VIEW,
        Permission.RECURRING_BILL_CREATE,
        Permission.RECURRING_BILL_EDIT,
    ],
    VIEWER: [
        Permission.TRANSACTION_VIEW,
        Permission.REPORT_VIEW,
        Permission.USER_VIEW,
        Permission.CATEGORY_VIEW,
        Permission.PAYMENT_METHOD_VIEW,
        Permission.RECURRING_BILL_VIEW,
    ],
};
//# sourceMappingURL=permissions.js.map