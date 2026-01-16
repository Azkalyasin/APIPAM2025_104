import dotenv from 'dotenv';
dotenv.config(); // ✅ HARUS PALING ATAS

import prisma from './config/database';
import bcrypt from 'bcrypt';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

async function testDatabase() {
  console.log('🔍 Starting database connection test...\n');

  try {
    // Test 1: Connect
    console.log('Test 1: Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    // Test 2: Count users
    console.log('Test 2: Counting users...');
    const userCount = await prisma.user.count();
    console.log(`👥 Total users: ${userCount}\n`);

    // Test 3: Test findUnique (yang error di log Anda)
    console.log('Test 3: Testing findUnique query...');
    const user = await prisma.user.findUnique({
      where: {
        email: 'admin.1@example.com',
      },
    });

    if (user) {
      console.log('✅ User found:');
      console.log({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      console.log('⚠️  User not found\n');
      console.log('Creating test user...');

      const hashedPassword = await bcrypt.hash('password123', 10);

      const newUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin.1@example.com',
          phone: '081234567890',
          password_hash: hashedPassword,
          role: 'ADMIN',
        },
      });

      console.log('✅ Test user created:', newUser);
    }

    console.log('\n✅ All tests passed!\n');
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected\n');
  }
}

testDatabase();
