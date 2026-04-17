import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${admin.username} (ID: ${admin.id})`);

  // Create regular user
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      role: 'USER',
    },
  });
  console.log(`Created regular user: ${user.username} (ID: ${user.id})`);

  // Create sample concerts
  const concert1 = await prisma.concert.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Concert Name 1',
      description:
        'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non. Fusce dignissim turpis sed non est orci sed in. Blandit ut purus nunc sed donec commodo morbi diam scelerisque.',
      seat: 500,
    },
  });
  console.log(`Created concert: ${concert1.name}`);

  const concert2 = await prisma.concert.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Concert Name 2',
      description:
        'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a.',
      seat: 200,
    },
  });
  console.log(`Created concert: ${concert2.name}`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
