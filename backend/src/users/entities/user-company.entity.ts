import { Role } from '@prisma/client';

export class UserCompany {
    userId: number;
    companyId: number;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
