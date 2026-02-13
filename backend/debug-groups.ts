import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@minhaempresa.com';
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        console.log('Resetting password for ' + email);
        const hash = await bcrypt.hash('123456', 10);
        await prisma.user.update({
            where: { email },
            data: { passwordHash: hash }
        });
        console.log('Password reset to 123456');
    } else {
        console.log('User not found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
