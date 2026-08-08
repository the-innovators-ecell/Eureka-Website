import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create default admins
  const admin1Password = await bcrypt.hash("Hidoi@007", 12);
  const admin2Password = await bcrypt.hash("Loveyou@3000", 12);

  const admin1 = await prisma.user.upsert({
    where: { email: "swapnilaryajua@gmail.com" },
    update: { password: admin1Password },
    create: {
      name: "Swapnil Arya",
      email: "swapnilaryajua@gmail.com",
      phone: "+919876543210",
      password: admin1Password,
      role: "ADMIN",
      year: "N/A",
      course: "Management / Admin",
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: "namanpriyasharmajua@gmail.com" },
    update: { password: admin2Password },
    create: {
      name: "Naman Priya Sharma",
      email: "namanpriyasharmajua@gmail.com",
      phone: "+919876543211",
      password: admin2Password,
      role: "ADMIN",
      year: "N/A",
      course: "Management / Admin",
    },
  });
  console.log(`✅ Admin 1 created: ${admin1.name} (${admin1.email})`);
  console.log(`✅ Admin 2 created: ${admin2.name} (${admin2.email})`);

  // Create sponsors
  const sponsors = await Promise.all([
    prisma.sponsor.upsert({
      where: { id: "sponsor-stark" },
      update: {},
      create: {
        id: "sponsor-stark",
        name: "Stark Industries",
        logoUrl: "/images/sponsors/stark.png",
        website: "https://starkindustries.com",
        tier: "TITLE",
        order: 1,
      },
    }),
    prisma.sponsor.upsert({
      where: { id: "sponsor-wayne" },
      update: {},
      create: {
        id: "sponsor-wayne",
        name: "Wayne Enterprises",
        logoUrl: "/images/sponsors/wayne.png",
        website: "https://wayneenterprises.com",
        tier: "GOLD",
        order: 2,
      },
    }),
    prisma.sponsor.upsert({
      where: { id: "sponsor-umbrella" },
      update: {},
      create: {
        id: "sponsor-umbrella",
        name: "Umbrella Corporation",
        logoUrl: "/images/sponsors/umbrella.png",
        website: "https://umbrellacorp.com",
        tier: "GOLD",
        order: 3,
      },
    }),
  ]);
  console.log(`✅ Created ${sponsors.length} sponsors`);

  // Create event
  const event = await prisma.event.upsert({
    where: { id: "event-ideaforge-2026" },
    update: {},
    create: {
      id: "event-ideaforge-2026",
      name: "IdeaForge 2026",
      description:
        "The flagship Ideathon by The Innovators - where groundbreaking ideas meet real-world impact. Join us for 24 hours of innovation, mentorship, and creative problem-solving.",
      date: new Date("2026-09-15T09:00:00"),
      venue: "Innovation Hub, Main Campus",
      registrationDeadline: new Date("2026-09-10T23:59:59"),
      status: "UPCOMING",
    },
  });
  console.log(`✅ Event created: ${event.name}`);

  // Create prizes
  const prizes = await Promise.all([
    prisma.prize.upsert({
      where: { id: "prize-winner" },
      update: {},
      create: {
        id: "prize-winner",
        eventId: event.id,
        title: "Winner",
        amount: "₹50,000",
        description: "First place team receives the grand prize along with mentorship opportunities and incubation support.",
        rank: 1,
        icon: "trophy",
      },
    }),
    prisma.prize.upsert({
      where: { id: "prize-runner" },
      update: {},
      create: {
        id: "prize-runner",
        eventId: event.id,
        title: "Runner Up",
        amount: "₹30,000",
        description: "Second place team receives recognition and networking opportunities with industry leaders.",
        rank: 2,
        icon: "medal",
      },
    }),
    prisma.prize.upsert({
      where: { id: "prize-innovation" },
      update: {},
      create: {
        id: "prize-innovation",
        eventId: event.id,
        title: "Special Innovation Award",
        amount: "₹15,000",
        description: "Awarded to the team with the most creative and innovative solution approach.",
        rank: 3,
        icon: "star",
      },
    }),
  ]);
  console.log(`✅ Created ${prizes.length} prizes`);

  // Create sample users
  const userPassword = await bcrypt.hash("User@12345", 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "rahul.sharma@email.com" },
      update: {},
      create: {
        name: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        phone: "9876543210",
        github: "https://github.com/rahulsharma",
        linkedin: "https://linkedin.com/in/rahulsharma",
        year: "3rd",
        course: "B.Tech Computer Science",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "priya.patel@email.com" },
      update: {},
      create: {
        name: "Priya Patel",
        email: "priya.patel@email.com",
        phone: "9876543211",
        github: "https://github.com/priyapatel",
        linkedin: "https://linkedin.com/in/priyapatel",
        year: "2nd",
        course: "B.Tech IT",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "amit.kumar@email.com" },
      update: {},
      create: {
        name: "Amit Kumar",
        email: "amit.kumar@email.com",
        phone: "9876543212",
        github: "https://github.com/amitkumar",
        linkedin: "https://linkedin.com/in/amitkumar",
        year: "4th",
        course: "B.Tech ECE",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "sneha.reddy@email.com" },
      update: {},
      create: {
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "9876543213",
        github: "https://github.com/snehareddy",
        linkedin: "https://linkedin.com/in/snehareddy",
        year: "3rd",
        course: "B.Tech CSE",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "vikram.singh@email.com" },
      update: {},
      create: {
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        phone: "9876543214",
        github: "https://github.com/vikramsingh",
        linkedin: "https://linkedin.com/in/vikramsingh",
        year: "2nd",
        course: "B.Tech AI&ML",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "ananya.gupta@email.com" },
      update: {},
      create: {
        name: "Ananya Gupta",
        email: "ananya.gupta@email.com",
        phone: "9876543215",
        github: "https://github.com/ananyagupta",
        linkedin: "https://linkedin.com/in/ananyagupta",
        year: "3rd",
        course: "B.Tech Data Science",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "rohan.mehta@email.com" },
      update: {},
      create: {
        name: "Rohan Mehta",
        email: "rohan.mehta@email.com",
        phone: "9876543216",
        github: "https://github.com/rohanmehta",
        linkedin: "https://linkedin.com/in/rohanmehta",
        year: "4th",
        course: "B.Tech Mechanical",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "kavya.nair@email.com" },
      update: {},
      create: {
        name: "Kavya Nair",
        email: "kavya.nair@email.com",
        phone: "9876543217",
        github: "https://github.com/kavyanair",
        linkedin: "https://linkedin.com/in/kavyanair",
        year: "2nd",
        course: "B.Tech Civil",
        password: userPassword,
        role: "USER",
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} sample users (password: User@12345)`);

  // Create sample teams
  const team1 = await prisma.team.upsert({
    where: { id: "team-innovators" },
    update: {},
    create: {
      id: "team-innovators",
      name: "Code Crusaders",
      inviteCode: "IDT-7F29X",
      status: "PENDING",
      memberCount: 3,
      leaderId: users[0].id,
    },
  });
  await prisma.user.update({ where: { id: users[0].id }, data: { teamId: team1.id } });
  await prisma.user.update({ where: { id: users[1].id }, data: { teamId: team1.id } });
  await prisma.user.update({ where: { id: users[2].id }, data: { teamId: team1.id } });

  const team2 = await prisma.team.upsert({
    where: { id: "team-visionaries" },
    update: {},
    create: {
      id: "team-visionaries",
      name: "Digital Dynamos",
      inviteCode: "IDT-K4M8P",
      status: "ACCEPTED",
      memberCount: 2,
      leaderId: users[3].id,
      acceptedAt: new Date(),
    },
  });
  await prisma.user.update({ where: { id: users[3].id }, data: { teamId: team2.id } });
  await prisma.user.update({ where: { id: users[4].id }, data: { teamId: team2.id } });

  const team3 = await prisma.team.upsert({
    where: { id: "team-nexgen" },
    update: {},
    create: {
      id: "team-nexgen",
      name: "NexGen Builders",
      inviteCode: "IDT-R2D5Q",
      status: "PENDING",
      memberCount: 3,
      leaderId: users[5].id,
    },
  });
  await prisma.user.update({ where: { id: users[5].id }, data: { teamId: team3.id } });
  await prisma.user.update({ where: { id: users[6].id }, data: { teamId: team3.id } });
  await prisma.user.update({ where: { id: users[7].id }, data: { teamId: team3.id } });

  console.log("✅ Created 3 sample teams");

  // Create sample projects
  await prisma.project.upsert({
    where: { teamId: team1.id },
    update: {},
    create: {
      teamId: team1.id,
      name: "EcoTrack",
      problem: "Urban areas generate massive amounts of waste, but citizens lack accessible tools to track their carbon footprint and find nearby recycling facilities, leading to poor waste management practices.",
      description: "EcoTrack is a mobile-first web application that helps urban residents track their daily carbon footprint, locate nearby recycling centers using geolocation, and earn rewards for sustainable practices. The platform uses gamification elements to encourage consistent eco-friendly behavior and provides personalized recommendations to reduce environmental impact.",
      submittedById: users[0].id,
      isLocked: true,
    },
  });

  await prisma.project.upsert({
    where: { teamId: team2.id },
    update: {},
    create: {
      teamId: team2.id,
      name: "MentorBridge",
      problem: "First-generation college students in rural India struggle to find mentors who can guide them through career decisions, internship applications, and professional development due to lack of professional networks.",
      description: "MentorBridge connects first-generation students with industry professionals and alumni through an AI-powered matching system. The platform considers mentee goals, mentor expertise, language preferences, and availability to create meaningful mentorship relationships. It includes video sessions, progress tracking, resource sharing, and community forums for peer support.",
      submittedById: users[3].id,
      isLocked: true,
    },
  });

  console.log("✅ Created 2 sample projects");

  console.log("\n🎉 Seed completed successfully!");
  console.log("📋 Default admin login: " + adminName + " / " + adminPassword);
  console.log("📋 Sample user login: Rahul Sharma / User@12345");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
