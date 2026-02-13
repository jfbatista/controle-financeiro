import { CompaniesService } from './companies.service';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    getMyCompany(user: CurrentUserData): Promise<{
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
    updateMyCompany(user: CurrentUserData, dto: UpdateCompanyDto): Promise<{
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
