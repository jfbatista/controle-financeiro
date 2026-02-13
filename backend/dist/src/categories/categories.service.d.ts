import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string | null;
    }[]>;
    create(companyId: number, dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string | null;
    }>;
    update(companyId: number, id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string | null;
    }>;
    remove(companyId: number, id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string | null;
    }>;
}
