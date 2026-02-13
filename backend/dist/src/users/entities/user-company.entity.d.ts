import { Role } from '@prisma/client';
export declare class UserCompany {
    userId: number;
    companyId: number;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
