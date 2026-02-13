import { CategoriesService } from './categories.service';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(user: CurrentUserData): Promise<any>;
    create(user: CurrentUserData, dto: CreateCategoryDto): Promise<any>;
    update(user: CurrentUserData, id: number, dto: UpdateCategoryDto): Promise<any>;
    remove(user: CurrentUserData, id: number): Promise<any>;
}
