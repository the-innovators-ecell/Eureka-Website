'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, Shield, ShieldCheck, Send } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const publicLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Event', href: '/#event' },
    { name: 'Sponsors', href: '/#sponsors' },
    { name: 'Prizes', href: '/#prizes' },
  ];

  const authLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Team', href: '/dashboard/team' },
    { name: 'Project', href: '/dashboard/project' },
  ];

  const adminLinks = [
    { name: 'Home', href: '/' },
    { name: 'Admin', href: '/admin' },
    { name: 'Teams', href: '/admin/teams' },
    { name: 'Manage', href: '/admin/management' },
    { name: 'Export', href: '/admin/export' },
    { name: 'Activity', href: '/admin/activity' },
    { name: 'Backup', href: '/admin/backup' },
  ];

  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const links = status === 'authenticated' ? (isAdmin ? adminLinks : authLinks) : publicLinks;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#E5C158] shadow-[0_0_15px_rgba(229,193,88,0.4)] flex-shrink-0">
              <Image src="/images/logo.png" alt="The Innovators Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white tracking-wider uppercase">EUREKA&apos;26</span>
                <span className="bg-[#E5C158]/15 text-[#E5C158] border border-[#E5C158]/40 px-2 py-0.5 text-[10px] font-black rounded-md tracking-widest uppercase">
                  IDEATHON
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium tracking-tight">The Innovators Club</span>
            </div>
          </Link>

          {/* Centered Floating Pill Navigation Container (Reference Image) */}
          <div className="hidden lg:flex items-center bg-[#111111]/90 border border-white/10 rounded-full px-3 py-1.5 shadow-2xl space-x-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href.startsWith('/#') && pathname === '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-[#282316] text-[#E5C158] border border-[#E5C158]/40 shadow-[0_0_12px_rgba(229,193,88,0.25)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'authenticated' ? (
              <>
                <Link 
                  href={isAdmin ? "/admin" : "/dashboard"} 
                  className="text-gray-300 hover:text-white text-xs uppercase tracking-wider font-bold px-3 py-2 transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-[#161616] border border-red-500/40 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-full"
                >
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white text-xs uppercase tracking-wider font-bold px-3 py-2 transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/register">
                  <button className="px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-black bg-[#E5C158] border border-[#E5C158] hover:bg-[#F3CE63] transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(229,193,88,0.35)] flex items-center gap-1.5 hover:scale-105">
                    <Send size={14} className="fill-black" /> REGISTER NOW
                  </button>
                </Link>
              </>
            )}

            <button 
              className="p-2 text-gray-400 hover:text-white bg-[#141414] border border-white/10 rounded-full transition-colors hidden md:flex items-center justify-center"
              title="Security Shield"
            >
              <ShieldCheck size={18} className="text-[#E5C158]" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-full bg-[#111111] border border-white/10 text-white hover:text-[#E5C158] transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 bg-[#0A0A0A] border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E5C158] relative">
                     <Image src="/images/logo.png" alt="The Innovators Logo" fill className="object-cover" />
                   </div>
                   <span className="font-extrabold text-white tracking-wider">EUREKA&apos;26</span>
                </div>
                <button onClick={closeMenu} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-xl text-gray-300 hover:bg-[#E5C158]/10 hover:text-[#E5C158] transition-all font-semibold uppercase text-xs tracking-wider"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="p-6 border-t border-white/10 flex flex-col gap-3">
                {status === 'authenticated' ? (
                  <button 
                    onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }); }}
                    className="w-full py-3 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider text-red-400 bg-[#161616] border border-red-500/40 rounded-xl"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <>
                    <Link href="/register" onClick={closeMenu}>
                      <button className="w-full py-3 text-xs font-extrabold uppercase tracking-wider text-black bg-[#E5C158] border border-[#E5C158] hover:bg-[#F3CE63] transition-all rounded-xl shadow-lg flex items-center justify-center gap-2">
                        <Send size={14} className="fill-black" /> REGISTER NOW
                      </button>
                    </Link>
                    <Link href="/login" onClick={closeMenu}>
                      <button className="w-full py-3 text-xs font-extrabold uppercase tracking-wider text-white bg-[#141414] border border-white/15 hover:bg-white/10 transition-all rounded-xl">
                        LOGIN
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

