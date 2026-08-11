import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProjectForm from '@/components/dashboard/ProjectForm';
import { CheckCircle2, AlertTriangle, FileText, Calendar, Download, FileSpreadsheet, Presentation } from 'lucide-react';

export const metadata = {
  title: 'Project Submission | Eureka Campus Ideathon',
};

export default async function ProjectPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      team: {
        include: {
          project: true,
        }
      }
    }
  });

  if (!user?.team) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          <AlertTriangle size={40} className="text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Team Required</h1>
        <p className="text-gray-400 mb-8 text-lg">
          You must create or join a team before you can submit a project proposal.
        </p>
      </div>
    );
  }

  const project = user.team.project;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Project Submission</h1>
        <p className="text-gray-400">Outline your solution for Eureka Campus Ideathon & Startup Pitching Competition.</p>
      </div>

      {project ? (
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#FFDF00]/10 p-8 border-b border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#D4AF37]/20 blur-3xl rounded-full" />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-semibold mb-4">
                  <CheckCircle2 size={16} /> Proposal Submitted
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] mb-2">{project.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#D4AF37]" /> Submitted on {project.submittedAt?.toLocaleDateString() || new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-[#D4AF37] mb-3 flex items-center gap-2">
                <AlertTriangle size={18} /> Real-World Problem
              </h3>
              <div className="bg-[#000000] rounded-xl p-5 border border-white/10 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.problem}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#FFDF00] mb-3 flex items-center gap-2">
                <FileText size={18} /> Solution Description
              </h3>
              <div className="bg-[#000000] rounded-xl p-5 border border-white/10 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </div>
            </div>

            {/* Submitted Presentation Slide (PPT) */}
            {project.pptUrl ? (
              <div>
                <h3 className="text-lg font-semibold text-[#D4AF37] mb-3 flex items-center gap-2">
                  <FileSpreadsheet size={18} /> Presentation Slide (PPT)
                </h3>
                <div className="bg-[#000000] rounded-xl p-5 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{project.pptName || 'Presentation Slide'}</p>
                      <p className="text-xs text-gray-400">Attached PPT / Presentation File</p>
                    </div>
                  </div>
                  <a
                    href={project.pptUrl}
                    download={project.pptName || 'presentation.ppt'}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#FFDF00] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  >
                    <Download size={14} /> Download Presentation
                  </a>
                </div>
              </div>
            ) : null}

            {/* Official Presentation Guide */}
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Presentation size={18} /> Presentation Guide
              </h3>
              <div className="bg-[#000000] rounded-xl p-5 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Presentation size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Official PPT Guide</p>
                    <p className="text-xs text-gray-400">Download the recommended structure & format</p>
                  </div>
                </div>
                <a
                  href="/api/resources/guide"
                  download
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0"
                >
                  <Download size={14} /> Download PPT Guide
                </a>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <ProjectForm />
        </div>
      )}
    </div>
  );
}

