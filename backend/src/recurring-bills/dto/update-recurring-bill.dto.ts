import { TransactionType } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateRecurringBillDto {
    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @IsOptional()
    @IsInt()
    @Min(1)
    categoryId?: number;

    @IsOptional()
    @IsNumber()
    @Min(0.01)
    amountExpected?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(31)
    dueDay?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
