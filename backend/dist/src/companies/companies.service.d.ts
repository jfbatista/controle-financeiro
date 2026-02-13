import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCompanyForUser(userId: number): Promise<{
        id: number;
        name: string;
        document: string | null;
        contactEmail: string | null;
        ownerUserId: number;
        createdAt: Date;
        updatedAt: Date;
        smtpHost: string | null;
        smtpPort: number | null;
        smtpUser: string | null;
        smtpPass: string | null;
        smtpSecure: boolean;
        smtpFrom: string | null;
    }>;
    updateCompanyForUser(userId: number, dto: UpdateCompanyDto): Promise<{
        id: number;
        name: string;
        document: string | null;
        contactEmail: string | null;
        ownerUserId: number;
        createdAt: Date;
        updatedAt: Date;
        smtpHost: string | null;
        smtpPort: number | null;
        smtpUser: string | null;
        smtpPass: string | null;
        smtpSecure: boolean;
        smtpFrom: string | null;
    }>;
}
