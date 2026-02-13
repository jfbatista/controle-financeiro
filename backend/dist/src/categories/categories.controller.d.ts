import { CategoriesService } from './categories.service';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(user: CurrentUserData): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string | null;
    }[]>;
    create(user: CurrentUserData, dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string | null;
    }>;
    update(user: CurrentUserData, id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: number;
        isActive: boolean;
        type: import("@prisma/client").$Enums.CategoryType;
        color: string | null;
    }>;
    remove(user: CurrentUserData, id: number): Promise<{
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
