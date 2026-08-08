# IdeaForge 2026 — API Documentation

All API routes are under `/api/`. Protected routes require a valid session cookie.

## Authentication

### POST `/api/auth/register`
Register a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "github": "https://github.com/johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "year": "3rd",
  "course": "B.Tech CSE",
  "password": "StrongPass@123",
  "confirmPassword": "StrongPass@123"
}
```

**Response:** `201` on success, `400` for validation errors, `409` for duplicate email/phone.

### POST `/api/auth/[...nextauth]`
NextAuth.js handler. Login via credentials provider (name + password).

---

## User (Authenticated)

### GET `/api/user/profile`
Get the current user's profile.

**Response:** User object with all fields except password.

### PUT `/api/user/profile`
Update profile fields.

**Body:**
```json
{
  "name": "Updated Name",
  "github": "https://github.com/newprofile",
  "linkedin": "https://linkedin.com/in/newprofile",
  "year": "4th",
  "course": "B.Tech IT"
}
```

### POST `/api/user/change-password`
Change the user's password.

**Body:**
```json
{
  "currentPassword": "OldPass@123",
  "newPassword": "NewPass@456",
  "confirmPassword": "NewPass@456"
}
```

---

## Teams (Authenticated)

### GET `/api/teams`
Get the current user's team (with members and project).

### POST `/api/teams`
Create a new team.

**Body:**
```json
{
  "name": "Team Name",
  "memberCount": 3,
  "memberNames": ["Member 2", "Member 3"]
}
```

**Response:** `{ message, inviteCode, team }`

### POST `/api/teams/join`
Join a team using an invite code.

**Body:**
```json
{
  "inviteCode": "IDT-7F29X"
}
```

### POST `/api/teams/leave`
Leave the current team (leader cannot leave).

### GET `/api/teams/[id]` *(Admin only)*
Get team details by ID.

### POST `/api/teams/[id]/accept` *(Admin only)*
Accept a team.

### POST `/api/teams/[id]/reject` *(Admin only)*
Reject a team.

### DELETE `/api/teams/[id]/delete` *(Admin only)*
Delete team and blacklist all members.

**Body:**
```json
{
  "reason": "Violation reason"
}
```

---

## Projects (Authenticated)

### POST `/api/projects`
Submit a project for the user's team.

**Body:**
```json
{
  "name": "Project Name",
  "problem": "The problem statement (20-500 chars)",
  "description": "Full description (50-2000 chars)"
}
```

### PUT `/api/projects` *(Admin only)*
Update a project (toggle lock, edit fields).

**Body:**
```json
{
  "projectId": "clxxx...",
  "isLocked": false,
  "name": "Updated Name",
  "problem": "Updated problem",
  "description": "Updated description"
}
```

---

## Admin Endpoints (Admin only)

### GET `/api/admin/stats`
Dashboard statistics.

**Response:**
```json
{
  "users": 150,
  "teams": { "total": 40, "accepted": 20, "rejected": 5, "pending": 15 },
  "projects": 35,
  "blacklistedUsers": 3,
  "admins": 2,
  "sponsors": 3,
  "registrationsChart": [...],
  "teamsChart": [...],
  "projectsChart": [...]
}
```

### GET `/api/admin/users`
List all users.

### PUT `/api/admin/users`
Change user role (promote/demote admin).

**Body:**
```json
{
  "userId": "clxxx...",
  "role": "ADMIN"
}
```

### PATCH `/api/admin/users`
Blacklist or unblacklist a user.

**Body:**
```json
{
  "userId": "clxxx...",
  "isBlacklisted": true,
  "reason": "Violation reason"
}
```

### GET `/api/admin/teams`
List all teams with leader, members, project.

### GET `/api/admin/search`
Unified search with pagination.

**Query params:**
- `q` — search term
- `status` — PENDING | ACCEPTED | REJECTED
- `year` — filter by year
- `course` — filter by course
- `sort` — newest | oldest | name
- `page` — page number (default: 1)
- `limit` — items per page (default: 20)

**Response:**
```json
{
  "teams": [...],
  "total": 40,
  "page": 1,
  "totalPages": 2
}
```

### GET `/api/admin/activity-logs`
Paginated activity logs.

**Query params:**
- `page` — page number (default: 1)
- `limit` — items per page (default: 50)
- `action` — filter by action type
- `userId` — filter by user ID
- `startDate` — ISO date string
- `endDate` — ISO date string

### GET `/api/admin/export/excel`
Download teams data as Excel (.xlsx).

### GET `/api/admin/export/csv`
Download teams data as CSV.

### GET `/api/admin/backup`
Download full database backup as JSON.

---

## Events & Sponsors (Public)

### GET `/api/events`
List upcoming events.

### GET `/api/sponsors`
List active sponsors.

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

| Status | Meaning                    |
|--------|----------------------------|
| 400    | Bad request / validation   |
| 401    | Authentication required    |
| 403    | Insufficient permissions   |
| 404    | Resource not found         |
| 409    | Conflict (duplicate)       |
| 429    | Rate limited               |
| 500    | Internal server error      |
