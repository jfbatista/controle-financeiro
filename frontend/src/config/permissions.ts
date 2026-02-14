export enum Permission {
    // Transactions
    TRANSACTION_VIEW = 'TRANSACTION_VIEW',
    TRANSACTION_CREATE = 'TRANSACTION_CREATE',
    TRANSACTION_EDIT = 'TRANSACTION_EDIT',
    TRANSACTION_DELETE = 'TRANSACTION_DELETE',

    // Users
    USER_VIEW = 'USER_VIEW',
    USER_INVITE = 'USER_INVITE',
    USER_EDIT = 'USER_EDIT',
    USER_DELETE = 'USER_DELETE',

    // Reports
    REPORT_VIEW = 'REPORT_VIEW',

    // Settings (General)
    SETTINGS_MANAGE = 'SETTINGS_MANAGE',
    // Company
    COMPANY_MANAGE = 'COMPANY_MANAGE',

    // Audit
    AUDIT_VIEW = 'AUDIT_VIEW',

    // Categories
    CATEGORY_VIEW = 'CATEGORY_VIEW',
    CATEGORY_CREATE = 'CATEGORY_CREATE',
    CATEGORY_EDIT = 'CATEGORY_EDIT',
    CATEGORY_DELETE = 'CATEGORY_DELETE',

    // Payment Methods
    PAYMENT_METHOD_VIEW = 'PAYMENT_METHOD_VIEW',
    PAYMENT_METHOD_CREATE = 'PAYMENT_METHOD_CREATE',
    PAYMENT_METHOD_EDIT = 'PAYMENT_METHOD_EDIT',
    PAYMENT_METHOD_DELETE = 'PAYMENT_METHOD_DELETE',

    // Recurring Bills
    RECURRING_BILL_VIEW = 'RECURRING_BILL_VIEW',
    RECURRING_BILL_CREATE = 'RECURRING_BILL_CREATE',
    RECURRING_BILL_EDIT = 'RECURRING_BILL_EDIT',
    RECURRING_BILL_DELETE = 'RECURRING_BILL_DELETE',
}

export type Role = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export const RolePermissions: Record<Role, Permission[]> = {
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
