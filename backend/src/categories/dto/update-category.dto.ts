import { CategoryType } from '@prisma/client';

export class UpdateCategoryDto {
  name?: string;
  type?: CategoryType;
  color?: string;
}

