import { PrismaClient, TransactionType, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Find the first company
    const company = await prisma.company.findFirst();
    if (!company) {
        console.error('❌ No company found. Please create a company via the app first.');
        return;
    }
    console.log(`🏢 Using company: ${company.name} (ID: ${company.id})`);

    // 2. Find the owner/user
    const user = await prisma.user.findFirst({
        where: { id: company.ownerUserId },
    });
    if (!user) {
        console.error('❌ Owner user not found.');
        return;
    }

    // 3. Ensure Categories Exist
    const categoriesData = [
        { name: 'Vendas', type: CategoryType.INCOME, color: 'green' },
        { name: 'Serviços', type: CategoryType.INCOME, color: 'teal' },
        { name: 'Comissões', type: CategoryType.INCOME, color: 'cyan' },
        { name: 'Aluguel', type: CategoryType.EXPENSE, color: 'orange' },
        { name: 'Energia', type: CategoryType.EXPENSE, color: 'yellow' },
        { name: 'Água', type: CategoryType.EXPENSE, color: 'blue' },
        { name: 'Internet', type: CategoryType.EXPENSE, color: 'purple' },
        { name: 'Fornecedores', type: CategoryType.EXPENSE, color: 'red' },
        { name: 'Salários', type: CategoryType.EXPENSE, color: 'pink' },
        { name: 'Marketing', type: CategoryType.EXPENSE, color: 'purple' },
    ];

    const categoriesMap = new Map<string, number>();

    for (const cat of categoriesData) {
        let category = await prisma.category.findFirst({
            where: { companyId: company.id, name: cat.name },
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    companyId: company.id,
                    name: cat.name,
                    type: cat.type,
                    color: cat.color,
                },
            });
            console.log(`   Created category: ${cat.name}`);
        }
        categoriesMap.set(cat.name, category.id);
    }

    // 4. Ensure Payment Methods Exist
    const methodsData = ['Pix', 'Dinheiro', 'Cartão de Crédito', 'Boleto', 'Transferência'];
    const methodsMap = new Map<string, number>();

    for (const name of methodsData) {
        let method = await prisma.paymentMethod.findFirst({
            where: { companyId: company.id, name },
        });

        if (!method) {
            method = await prisma.paymentMethod.create({
                data: {
                    companyId: company.id,
                    name,
                },
            });
            console.log(`   Created payment method: ${name}`);
        }
        methodsMap.set(name, method.id);
    }

    // 5. Generate Transactions for the last 6 months
    const today = new Date();
    const monthsToSeed = 6;

    console.log(`📅 Generating transactions for the last ${monthsToSeed} months...`);

    for (let i = 0; i < monthsToSeed; i++) {
        const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Random number of transactions per month (10-30)
        const numTransactions = Math.floor(Math.random() * 20) + 10;

        for (let j = 0; j < numTransactions; j++) {
            const day = Math.floor(Math.random() * daysInMonth) + 1;
            const date = new Date(year, month, day);

            const isIncome = Math.random() > 0.6; // 40% income, 60% expense
            const type = isIncome ? TransactionType.INCOME : TransactionType.EXPENSE;

            // Select random category matching type
            const relevantCats = categoriesData.filter(c => c.type === (isIncome ? CategoryType.INCOME : CategoryType.EXPENSE));
            const randomCat = relevantCats[Math.floor(Math.random() * relevantCats.length)];
            const categoryId = categoriesMap.get(randomCat.name)!;

            // Select random payment method
            const randomMethodName = methodsData[Math.floor(Math.random() * methodsData.length)];
            const paymentMethodId = methodsMap.get(randomMethodName)!;

            // Random amount
            const amount = isIncome
                ? Math.floor(Math.random() * 5000) + 500 // 500 - 5500 for income
                : Math.floor(Math.random() * 1000) + 50; // 50 - 1050 for expense

            await prisma.transaction.create({
                data: {
                    companyId: company.id,
                    type,
                    categoryId,
                    paymentMethodId,
                    date,
                    amount,
                    description: `Lançamento automático ${j + 1} - ${randomCat.name}`,
                    createdByUserId: user.id,
                },
            });
        }
        console.log(`   ✅ Generated ${numTransactions} transactions for ${year}-${month + 1}`);
    }

    console.log('✅ Seeding completed! Restart your dashboard to see the data.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
