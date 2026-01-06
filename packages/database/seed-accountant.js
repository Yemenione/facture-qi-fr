const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'expert@cabinet.fr';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

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
        role: 'ADMIN',
      },
    });
  } else {
    // Create a dummy company to satisfy relations
    let company = await prisma.company.findFirst({
      where: { email: 'contact@cabinet.fr' }
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: 'Cabinet Expert Demo',
          email: 'contact@cabinet.fr',
        }
      });
    }

    console.log(`Using company: ${company.name}`);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'ADMIN', // Using ADMIN to ensure access
        companyId: company.id,
      },
    });
    console.log(`Created user: ${email}`);
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
