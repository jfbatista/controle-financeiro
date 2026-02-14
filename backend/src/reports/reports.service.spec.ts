import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

describe('ReportsService', () => {
    let service: ReportsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        transaction: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReportsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ReportsService>(ReportsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDRE', () => {
        it('should calculate DRE correctly', async () => {
            const companyId = 1;
            const from = '2023-01-01';
            const to = '2023-01-31';

            // Mock Incomes
            const mockIncomes = [
                { amount: 1000, category: { name: 'Sales' } },
                { amount: 500, category: { name: 'Services' } },
            ];

            // Mock Expenses
            const mockExpenses = [
                { amount: 200, category: { name: 'Rent' } },
                { amount: 100, category: { name: 'Utilities' } },
            ];

            // Setup findMany mocks
            (prisma.transaction.findMany as jest.Mock)
                .mockResolvedValueOnce(mockIncomes) // First call is for INCOME
                .mockResolvedValueOnce(mockExpenses); // Second call is for EXPENSE

            const result = await service.getDRE(companyId, from, to);

            expect(result.incomes.total).toBe(1500);
            expect(result.expenses.total).toBe(300);
            expect(result.result).toBe(1200);
            expect(result.profitMargin).toBe(80); // (1200 / 1500) * 100
            expect(result.incomes.breakdown).toHaveLength(2);
            expect(result.expenses.breakdown).toHaveLength(2);
        });

        it('should handle zero income', async () => {
            (prisma.transaction.findMany as jest.Mock)
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([{ amount: 100, category: { name: 'Rent' } }]);

            const result = await service.getDRE(1, '2023-01-01', '2023-01-31');

            expect(result.incomes.total).toBe(0);
            expect(result.expenses.total).toBe(100);
            expect(result.result).toBe(-100);
            expect(result.profitMargin).toBe(0);
        });
    });
});
