import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: number): Promise<any>;
    create(companyId: number, dto: CreateCategoryDto): Promise<any>;
    update(companyId: number, id: number, dto: UpdateCategoryDto): Promise<any>;
    remove(companyId: number, id: number): Promise<any>;
}
