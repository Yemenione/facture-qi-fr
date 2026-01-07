const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 1. Manual .env loading
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
        console.log('Looking for .env at:', envPath);
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, '');
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            console.log('Loaded .env file manually.');
        } else {
            console.log('No .env file found.');
        }
    } catch (e) {
        console.error('Failed to load .env', e);
    }
}

loadEnv();

console.log('DATABASE_URL is:', process.env.DATABASE_URL ? 'DEFINED' : 'UNDEFINED');

const prisma = new PrismaClient();

async function main() {
    const email = 'expert@cabinet.fr';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Checking user ${email}...`);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists. Updating password...`);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                // Ensure role is correct for accountant app
                role: 'FIRM_ADMIN',
            },
        });
        console.log('Password updated to: password123');
    } else {
        console.log(`User ${email} not found. Creating...`);

        // Create a dummy company to satisfy relations
        let company = await prisma.company.findFirst({
            where: { email: 'contact@cabinet.fr' }
        });

        if (!company) {
            // Check if siren '000000000' exists to avoid collision
            const conflictSiren = await prisma.company.findUnique({
                where: { siren: '000000000' }
            });

            if (conflictSiren) {
                company = conflictSiren;
                console.log('Found existing company by SIREN 000000000');
            } else {
                // Need a plan first?
                let plan = await prisma.subscriptionPlan.findFirst({ where: { code: 'FREE' } });
                if (!plan) {
                    // Create default plan if missing
                    plan = await prisma.subscriptionPlan.create({
                        data: {
                            code: 'FREE',
                            name: 'Freemium',
                            priceMonthly: 0,
                            maxInvoices: 10,
                            maxUsers: 1,
                            features: {}
                        }
                    })
                }

                company = await prisma.company.create({
                    data: {
                        name: 'Cabinet Expert Demo',
                        email: 'contact@cabinet.fr',
                        siren: '000000000',
                        planId: plan.id,
                        subscriptionStatus: 'ACTIVE',
                        address: {},
                    }
                });
            }
        }

        // Ensure AccountantFirm exists for FIRM_ADMIN
        let firm = await prisma.accountantFirm.findFirst();
        if (!firm) {
            firm = await prisma.accountantFirm.create({
                data: {
                    name: 'Mon Cabinet',
                    email: 'contact@firm.com'
                }
            });
        }

        // Double check if user exists now (race condition?)
        const u = await prisma.user.findUnique({ where: { email } });
        if (!u) {
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName: 'Jean',
                    lastName: 'Dupont',
                    role: 'FIRM_ADMIN',
                    accountantFirmId: firm.id,
                },
            });
            console.log(`Created user: ${email} with password: password123`);
        } else {
            console.log('User created by someone else?');
        }
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
