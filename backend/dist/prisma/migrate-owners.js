"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting migration of owners to UserCompany...');
    const companies = await prisma.company.findMany();
    for (const company of companies) {
        if (company.ownerUserId) {
            console.log(`Migrating owner ${company.ownerUserId} for company ${company.id}`);
            await prisma.userCompany.upsert({
                where: {
                    userId_companyId: {
                        userId: company.ownerUserId,
                        companyId: company.id,
                    },
                },
                update: {
                    role: client_1.Role.OWNER,
                },
                create: {
                    userId: company.ownerUserId,
                    companyId: company.id,
                    role: client_1.Role.OWNER,
                },
            });
        }
    }
    console.log('Migration completed.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=migrate-owners.js.map