import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col selection:bg-[#D4AF37]/30">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-16 relative z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none -z-10" />
        {children}
      </main>
      <Footer />
    </div>
  );
}
