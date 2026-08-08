import Link from 'next/link';
import { ShieldCheck, ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Eureka Campus Ideathon 2026',
  description: 'Official Terms & Conditions for Eureka Campus Ideathon & Startup Pitching Competition at Jaypee University Anoopshahr.',
};

const termsList = [
  "The competition is open to individual participants or teams comprising a maximum of 4 members.",
  "Registration through the official event portal is mandatory.",
  "Participants must register on the Eureka! Portal using the designated NEC Referral ID to be eligible for further evaluation.",
  "Each team may submit only one startup idea.",
  "Startup ideas may be at the Idea, Prototype, MVP, or Early Startup stage.",
  "All submitted ideas must be original and owned by the participating team.",
  "Plagiarism, duplicate submissions, or copyright infringement will result in immediate disqualification.",
  "Submission of false information or forged documents will lead to cancellation of participation.",
  "Participants are solely responsible for protecting their own Intellectual Property (IP).",
  "The organizers will not claim ownership of any participant’s idea or innovation.",
  "Teams must report at least 30 minutes before their scheduled pitching slot.",
  "Every team will receive 2 minutes to pitch followed by 3 minutes of jury interaction.",
  "Exceeding the allotted presentation time may result in score deductions.",
  "Teams must carry their presentation in PDF or PPT/PPTX format.",
  "Presentation files must be submitted within the deadline announced by the organizers.",
  "Internet-based demonstrations should have an offline backup wherever possible.",
  "Only registered team members are permitted to present.",
  "Team composition cannot be changed after the registration deadline without prior organizer approval.",
  "Judges may ask questions regarding technology, business model, finance, market, validation, scalability, or execution.",
  "Startups will be evaluated on Innovation, Problem Validation, Solution, Market Opportunity, Business Model, Feasibility, Scalability, Team Capability, Presentation Skills, and Q&A Performance.",
  "The jury’s decision shall be final and binding and shall not be subject to appeal.",
  "Any attempt to influence, lobby, or manipulate judges or organizers will result in immediate disqualification.",
  "Participants must maintain professional behavior throughout the competition.",
  "Harassment, discrimination, abusive language, or misconduct will not be tolerated.",
  "Participants must comply with all instructions issued by the organizing committee.",
  "Failure to report on time may result in forfeiture of the pitching slot.",
  "The organizers reserve the right to reject incomplete or ineligible registrations.",
  "The organizers may verify the authenticity of any submitted information or startup claim.",
  "The organizing committee reserves the right to modify the schedule, judging process, venue, or event format when necessary.",
  "The organizers reserve the right to merge categories, postpone, or cancel the event due to unforeseen circumstances.",
  "The organizers shall not be responsible for technical failures, hardware malfunctions, internet disruptions, or loss of data during the event.",
  "Participants are responsible for arranging their own travel, accommodation, and personal belongings.",
  "The organizers shall not be liable for personal injury, loss, or damage incurred during the event, except where applicable law provides otherwise.",
  "Event photographs, videos, recordings, and participant information may be used for promotional, reporting, and documentation purposes.",
  "Winners must submit their final pitch deck and other required documents within the timeline specified by the organizers.",
  "Selection as a campus winner does not guarantee advancement to the Eureka! Zonal Round, which remains subject to the eligibility criteria of E-Cell IIT Bombay.",
  "Any dispute arising from the competition shall be addressed and resolved by the Organizing Committee.",
  "The organizers reserve the right to disqualify any participant found violating the competition rules at any stage.",
  "Participants are expected to maintain confidentiality regarding sensitive or unpublished information shared by other teams.",
  "By registering, participants acknowledge that they have read, understood, and agreed to these Terms & Conditions.",
  "Only startup ideas with legal and ethical applications are permitted.",
  "Ideas promoting violence, hate speech, illegal activities, or discrimination will not be accepted.",
  "Participants must ensure that all information, statistics, claims, and data presented during the competition are accurate and verifiable to the best of their knowledge.",
  "Financial projections must be realistic and supported by reasonable assumptions.",
  "AI tools may be used for preparing presentations; however, the underlying startup concept, claims, and business model must represent the participant’s own work.",
  "The organizing committee reserves the right to request additional information or clarification regarding any submitted startup.",
  "Participants may be required to provide evidence supporting claims regarding prototypes, users, validation, revenue, partnerships, or customer feedback.",
  "Judges may recognize exceptional innovation, social impact, technological advancement, or market potential during evaluation.",
  "Judges may deduct marks for unrealistic claims, unsupported data, misleading information, or poor understanding of the proposed business.",
  "Teams must strictly respect the allotted pitch and Q&A timings.",
  "No team may replace its presenter after the pitching session has commenced without prior organizer approval.",
  "Participants must ensure that all presentation material complies with applicable copyright, trademark, and other intellectual property laws.",
  "Offensive, defamatory, discriminatory, or inappropriate content is prohibited during presentations.",
  "Teams must not disrupt, interfere with, or intentionally distract other participants during their presentations.",
  "Recording jury deliberations, confidential discussions, or score sheets without permission is prohibited.",
  "Participants may interact or network with judges only in accordance with the event guidelines.",
  "Teams must not engage in lobbying, canvassing, solicitation, or attempts to secure preferential treatment from judges.",
  "Participants must respect the confidentiality of other teams’ unpublished ideas and business information.",
  "The organizers reserve the right to verify the identity of any participant at any stage of the competition.",
  "Valid student or government-issued identification may be requested during registration, check-in, or verification.",
  "Multiple registrations using different team names for substantially the same startup idea are prohibited.",
  "Impersonation or misrepresentation of another participant will result in immediate disqualification.",
  "Teams must notify the organizers promptly if they wish to withdraw from the competition.",
  "Registration fees, if applicable, shall be non-refundable unless otherwise specified by the organizers.",
  "Certificates will be issued only to participants who meet the applicable participation requirements.",
  "Winners who fail to submit required documents within the prescribed timeline may forfeit their awards, recognition, or nomination.",
  "The organizers reserve the right to withhold or cancel prizes in cases of rule violations, misconduct, or eligibility issues.",
  "Prizes, awards, and recognitions are non-transferable and cannot be exchanged for cash unless expressly specified.",
  "Participants must comply with all venue safety, security, and institutional regulations.",
  "The organizers reserve the right to deny entry or remove any participant who violates venue or event policies.",
  "Participants are solely responsible for their personal belongings and equipment.",
  "Participants are expected to maintain professional, ethical, and respectful conduct throughout the event.",
  "Any attempt to manipulate judging, scoring, voting, or evaluation procedures will result in immediate disqualification.",
  "Decisions regarding eligibility, scoring, ranking, awards, and disqualification shall rest with the Organizing Committee and appointed jury.",
  "Violation of competition rules may result in a warning, score deduction, disqualification, or removal from the event.",
  "The organizers reserve the right to amend these Terms & Conditions when necessary.",
  "Continued participation after an amendment shall constitute acceptance of the updated Terms & Conditions.",
  "Participation in the competition does not establish any partnership, employment, investment, agency, or legal relationship with the organizers.",
  "Submission of an application does not guarantee selection for the pitching round.",
  "By participating, all teams agree to abide by the Code of Conduct, Competition Guidelines, Terms & Conditions, and decisions of The Innovators, Jua and the appointed jury.",
  "If any participant or team attempted to register by multiple mails they will going to be disqualified."
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-[#FFDF00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#FFDF00] mb-8 bg-[#111111] border border-[#D4AF37]/30 px-4 py-2 rounded-full transition-all"
        >
          <ArrowLeft size={16} /> Return to Registration
        </Link>

        <div className="bg-[#111111]/90 border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37]">
                Terms & Conditions
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Eureka Campus Ideathon & Startup Pitching Competition — Jaypee University Anoopshahr
              </p>
            </div>
          </div>

          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar border-t border-b border-white/10 py-6 my-6">
            {termsList.map((term, index) => (
              <div key={index} className="flex items-start gap-3.5 text-sm text-gray-300 leading-relaxed">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <p className="pt-0.5">{term}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-gray-200 leading-relaxed flex items-start gap-3 mt-6">
            <ShieldCheck size={24} className="text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#D4AF37] uppercase tracking-wider mb-1">Important Note</p>
              <p>
                All participants must check the Terms & Conditions box to be eligible for registration. By agreeing, participants grant permission to use event photos/clips for marketing purposes. Disqualification applies to any rule violations. Decisions of the organizing committee and jury are final and binding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
