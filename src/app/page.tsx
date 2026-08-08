import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import EventSection from '@/components/home/EventSection';
import SponsorsSection from '@/components/home/SponsorsSection';
import PrizesSection from '@/components/home/PrizesSection';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eureka Campus Ideathon & Startup Pitching Competition | Jaypee University Anoopshahr',
  description: 'Join Eureka Campus Ideathon & Startup Pitching Competition at Jaypee University Anoopshahr on 22 August 2026. Pitch radical ideas and build solutions that shape the future.',
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <EventSection />
      <SponsorsSection />
      <PrizesSection />
      <Footer />
    </main>
  );
}
