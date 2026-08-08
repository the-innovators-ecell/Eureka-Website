import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function check() {
  console.log("🔍 Checking database connection and contents...");
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        isBlacklisted: true,
      }
    });

    console.log(`📊 Total Users in DB: ${users.length}`);

    for (const u of users) {
      console.log(`\nUser: [${u.id}] Name="${u.name}", Email="${u.email}", Role=${u.role}, Blacklisted=${u.isBlacklisted}`);
      
      if (u.email === 'swapnilaryajua@gmail.com') {
        const p1 = await bcrypt.compare('Hidoi@007', u.password);
        console.log(`  🔑 Password 'Hidoi@007' test: ${p1 ? '✅ MATCH' : '❌ MISMATCH'}`);
      }

      if (u.email === 'namanpriyasharmajua@gmail.com') {
        const p2 = await bcrypt.compare('Loveyou@3000', u.password);
        console.log(`  🔑 Password 'Loveyou@3000' test: ${p2 ? '✅ MATCH' : '❌ MISMATCH'}`);
      }
    }
  } catch (error) {
    console.error("❌ Database query error:", error);
  }
}

check().finally(() => prisma.$disconnect());
