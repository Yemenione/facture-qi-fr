const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Simple .env parser since we can't depend on dotenv
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
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
            console.log('Loaded .env file');
        } else {
            console.log('No .env file found at:', envPath);
        }
    } catch (e) {
        console.error('Failed to load .env', e);
    }
}

loadEnv();

console.log('DB URL:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting...');
    try {
        const users = await prisma.user.findMany({
            include: { company: true }
        });
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log('------------------------------------------------');
            console.log(`ID: ${u.id}`);
            console.log(`Email: ${u.email}`);
            console.log(`Role: ${u.role}`);
            console.log(`Company: ${u.company?.name} (${u.companyId})`);
            console.log(`Password Hash: ${u.password ? u.password.substring(0, 15) + '...' : 'NULL'}`);
        });
    } catch (e) {
        console.error('Error querying users:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
