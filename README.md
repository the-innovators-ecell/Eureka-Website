# IdeaForge 2026 — Ideathon Website

A production-ready full-stack ideathon management platform built for **The Innovators** club. Manage teams, project submissions, judging, and event operations with a luxury dark-themed UI.

## Tech Stack

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| Framework      | Next.js 15 (App Router)                         |
| Language       | TypeScript                                      |
| Database       | MySQL 8.0+ via Prisma ORM                       |
| Auth           | NextAuth v5 (Auth.js) with JWT sessions         |
| Styling        | Tailwind CSS v4                                 |
| Animations     | Motion (Framer Motion)                          |
| UI Components  | Shadcn UI + Lucide React icons                  |
| Forms          | React Hook Form + Zod validation                |
| Excel Export   | ExcelJS                                         |
| Notifications  | Sonner                                          |

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **MySQL** 8.0+ (local or remote)
- **npm** 9+

---

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd Website-1
npm install
```

### 2. Configure MySQL

Start your local MySQL server and create the database:

```sql
CREATE DATABASE ideathon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Environment Variables

Copy the example and fill in your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ideathon"
NEXTAUTH_SECRET="generate-a-secure-random-string"
AUTH_SECRET="same-as-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_NAME="Admin"
ADMIN_EMAIL="admin@ideathon.com"
ADMIN_PASSWORD="Admin@123456"
```

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to MySQL (creates all tables)
npx prisma db push

# Seed with sample data + admin account
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Default Logins

| Role  | Name          | Password      |
|-------|---------------|---------------|
| Admin | Admin         | Admin@123456  |
| User  | Rahul Sharma  | User@12345    |

---

## Production Deployment

### Database

Use a hosted MySQL service:
- **PlanetScale** (recommended)
- **Railway MySQL**
- **Aiven MySQL**
- **AWS RDS MySQL**
- **Any MySQL 8.0+ VPS**

Simply change `DATABASE_URL` in your production environment variables. **No code changes required.**

### Vercel Deployment

1. Push to GitHub
2. Import in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

The `postinstall` script auto-runs `prisma generate` during deployment.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── admin/            # Admin dashboard pages
│   │   ├── activity/     # Activity logs
│   │   ├── backup/       # Database backup
│   │   ├── export/       # Excel/CSV export
│   │   ├── management/   # User role management
│   │   └── teams/        # Team management
│   ├── api/              # REST API routes
│   │   ├── admin/        # Admin-only APIs
│   │   ├── auth/         # Authentication APIs
│   │   ├── teams/        # Team CRUD APIs
│   │   ├── projects/     # Project APIs
│   │   ├── user/         # User profile APIs
│   │   ├── events/       # Events API
│   │   └── sponsors/     # Sponsors API
│   ├── dashboard/        # User dashboard
│   └── page.tsx          # Homepage
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── home/             # Homepage sections
│   ├── layout/           # Navbar, Footer
│   └── ui/               # Shared UI components
├── lib/
│   ├── prisma.ts         # Database client
│   ├── auth-guard.ts     # Auth middleware helpers
│   ├── activity-logger.ts # Activity audit logging
│   ├── rate-limiter.ts   # Brute-force protection
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Utility functions
├── auth.ts               # NextAuth configuration
prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Database seeder
```

---

## Available Scripts

| Command              | Description                    |
|---------------------|--------------------------------|
| `npm run dev`       | Start development server       |
| `npm run build`     | Build for production           |
| `npm run start`     | Start production server        |
| `npm run lint`      | Run ESLint                     |
| `npm run db:push`   | Push schema changes to DB      |
| `npm run db:seed`   | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio GUI         |
| `npm run db:generate` | Regenerate Prisma client     |

---

## Features

### Public
- Luxury dark-themed landing page
- User registration with validation
- Login with session management

### User Dashboard
- Profile view
- Create/join teams (2-4 members)
- Submit project proposals

### Admin Dashboard
- Real-time statistics (users, teams, projects)
- Accept/reject teams
- Blacklist users
- Promote/demote admins
- **Excel export** (professional formatting with ExcelJS)
- **CSV export**
- **Database backup** (JSON)
- **Activity logs** (full audit trail)
- **Search & filters** with pagination

### Security
- bcrypt password hashing (12 rounds)
- JWT session management
- Role-based authorization
- Rate limiting on login (5 attempts / 15 min)
- Input validation on all endpoints (Zod)
- SQL injection prevention (Prisma ORM)

---

## License

Private — The Innovators, IIT Bombay
