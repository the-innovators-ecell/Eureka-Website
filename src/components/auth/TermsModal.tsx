'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-3xl my-auto max-h-[85vh] flex flex-col rounded-3xl border border-[#D4AF37]/40 bg-[#0E0E0E] p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)]"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400 hover:text-white transition p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3.5 mb-4 shrink-0 pr-8">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                Terms & Conditions
              </h2>
              <p className="text-xs text-gray-400">
                Official Rules for Participants — Eureka Campus Ideathon 2026
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-3 py-4 border-t border-b border-white/10 my-2 text-xs md:text-sm text-gray-300">
            {termsList.map((term, index) => (
              <div key={index} className="flex items-start gap-3 leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <p className="pt-0.5">{term}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-[#D4AF37]" />
              <span>Mandatory agreement required for registration</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/terms-and-conditions"
                target="_blank"
                className="px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                Open in Full Page <ExternalLink size={14} />
              </Link>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#FFDF00] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
