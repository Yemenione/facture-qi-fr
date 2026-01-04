
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@facture-fr.com';
    const password = 'admin123';

    console.log(`Checking for admin user: ${email}...`);

    const existing = await prisma.superAdmin.findUnique({
        where: { email },
    });

    if (existing) {
        console.log('✅ Admin user already exists.');
        // Optional: Reset password just in case
        // const hashedPassword = await bcrypt.hash(password, 10);
        // await prisma.superAdmin.update({ where: { email }, data: { password: hashedPassword } });
        // console.log('🔄 Password reset to "admin123".');
    } else {
        console.log('⚠️ Admin user not found. Creating...');
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.superAdmin.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Super Admin',
            },
        });
        console.log('✅ Admin user created successfully.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
