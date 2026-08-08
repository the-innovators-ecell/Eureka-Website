import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing all participant, team, project, and activity data...");

  // 1. Unlink team relations on users first
  await prisma.user.updateMany({
    data: { teamId: null }
  });

  // 2. Delete Projects
  const deletedProjects = await prisma.project.deleteMany();
  console.log(`🗑️ Deleted ${deletedProjects.count} projects.`);

  // 3. Delete Teams
  const deletedTeams = await prisma.team.deleteMany();
  console.log(`🗑️ Deleted ${deletedTeams.count} teams.`);

  // 4. Delete Blacklists & Activity Logs
  const deletedBlacklist = await prisma.blacklist.deleteMany();
  console.log(`🗑️ Deleted ${deletedBlacklist.count} blacklist records.`);

  const deletedLogs = await prisma.activityLog.deleteMany();
  console.log(`🗑️ Deleted ${deletedLogs.count} activity log records.`);

  // 5. Delete all existing Users
  const deletedUsers = await prisma.user.deleteMany();
  console.log(`🗑️ Deleted ${deletedUsers.count} users.`);

  // 6. Create the 2 Admin Accounts
  console.log("👑 Creating updated Admin accounts...");

  const admin1Password = await bcrypt.hash("Hidoi@007", 12);
  const admin2Password = await bcrypt.hash("Loveyou@3000", 12);

  const admin1 = await prisma.user.create({
    data: {
      name: "Swapnil",
      email: "swapnilaryajua@gmail.com",
      phone: "+919876543210",
      password: admin1Password,
      role: "ADMIN",
      year: "N/A",
      course: "Management / Admin",
    }
  });
  console.log(`✅ Admin 1 created: ${admin1.name} (${admin1.email})`);

  const admin2 = await prisma.user.create({
    data: {
      name: "Naman",
      email: "namanpriyasharmajua@gmail.com",
      phone: "+919876543211",
      password: admin2Password,
      role: "ADMIN",
      year: "N/A",
      course: "Management / Admin",
    }
  });
  console.log(`✅ Admin 2 created: ${admin2.name} (${admin2.email})`);

  console.log("\n🎉 Database cleanup and admin reset completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Reset script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
