import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const metadata = {
  title: 'Dashboard | Eureka Campus Ideathon',
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Fetch full user data including team and project
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      team: {
        include: {
          members: true,
          project: true,
        }
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  return <DashboardContent user={user} team={user.team} />;
}
