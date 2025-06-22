import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('225Enya_system', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@rsnnews.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@rsnnews.com',
      password,
    },
  });
  console.log('Super admin seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
