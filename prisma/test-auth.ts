import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function test() {
  const u1 = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'swapnilaryajua@gmail.com' },
        { name: 'Swapnil' }
      ]
    }
  });
  console.log('User 1:', u1?.name, u1?.email);
  if (u1) {
    const match1 = await bcrypt.compare('Hidoi@007', u1.password);
    console.log('Password Hidoi@007 match:', match1);
  }

  const u2 = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'namanpriyasharmajua@gmail.com' },
        { name: 'Naman' }
      ]
    }
  });
  console.log('User 2:', u2?.name, u2?.email);
  if (u2) {
    const match2 = await bcrypt.compare('Loveyou@3000', u2.password);
    console.log('Password Loveyou@3000 match:', match2);
  }
}

test()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
