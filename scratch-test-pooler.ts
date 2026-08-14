import { PrismaClient } from '@prisma/client';

const poolerUrl = "postgresql://postgres.wqonwdwcdohrxrcceezm:ecellhumarahai007@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: poolerUrl
    }
  }
});

async function main() {
  console.log("Testing connection to Supabase pooler...");
  const count = await prisma.user.count();
  console.log("SUCCESS! User count in database:", count);
}

main()
  .catch((err) => {
    console.error("POOLER_CONNECTION_ERROR:", err);
  })
  .finally(() => prisma.$disconnect());
