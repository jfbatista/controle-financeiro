import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: number) {
    return this.prisma.category.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

  async create(companyId: number, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        companyId,
        name: dto.name,
        type: dto.type,
        color: dto.color,
      },
    });
  }

  async update(companyId: number, id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: { id, companyId },
    });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name ?? category.name,
        type: dto.type ?? category.type,
        color: dto.color ?? category.color,
      },
    });
  }

  async remove(companyId: number, id: number) {
    const category = await this.prisma.category.findFirst({
      where: { id, companyId },
    });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }
    // Soft delete: marcar como inativa
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

