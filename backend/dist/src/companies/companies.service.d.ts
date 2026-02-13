import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCompanyForUser(userId: number): Promise<any>;
    updateCompanyForUser(userId: number, dto: UpdateCompanyDto): Promise<any>;
}
