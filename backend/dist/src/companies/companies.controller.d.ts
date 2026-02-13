import { CompaniesService } from './companies.service';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    getMyCompany(user: CurrentUserData): Promise<any>;
    updateMyCompany(user: CurrentUserData, dto: UpdateCompanyDto): Promise<any>;
}
