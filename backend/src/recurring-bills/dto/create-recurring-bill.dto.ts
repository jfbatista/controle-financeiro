import {
  IsEnum,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateRecurringBillDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsInt()
  @Min(1)
  categoryId: number;

  @IsNumber()
  @Min(0.01)
  amountExpected: number;

  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;

  @IsOptional()
  @IsString()
  description?: string;
}
