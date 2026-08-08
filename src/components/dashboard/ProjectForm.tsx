'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/validations';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Send, AlertCircle, Info, FileSpreadsheet, UploadCloud, X } from 'lucide-react';
import * as z from 'zod';
import { cn } from '@/lib/utils';

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [pptFile, setPptFile] = useState<{ name: string; url: string; size: string } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      problem: '',
      description: '',
      pptUrl: '',
      pptName: '',
    },
  });

  const problemText = watch('problem');
  const descriptionText = watch('description');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxLimitInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxLimitInBytes) {
      toast.error('File size exceeds the 10MB limit. Please upload a smaller file.');
      e.target.value = '';
      return;
    }

    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPptFile({
        name: file.name,
        url: dataUrl,
        size: fileSizeFormatted,
      });
      setValue('pptUrl', dataUrl);
      setValue('pptName', file.name);
      toast.success(`PPT attached: ${file.name} (${fileSizeFormatted})`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePpt = () => {
    setPptFile(null);
    setValue('pptUrl', '');
    setValue('pptName', '');
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (!data.problem?.trim() && !data.description?.trim() && !data.pptUrl) {
      toast.error('Please either fill in project details or upload your project PPT / PDF file (Max 10MB).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit project');
      }

      toast.success('Project proposal submitted successfully!');
      router.refresh();
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4 flex gap-3 text-[#D4AF37] mb-6">
        <Info size={20} className="shrink-0 mt-0.5" />
        <p className="text-sm">
          Submit your project by uploading your <strong>PPT or PDF proposal (Max 10MB)</strong> or filling out the project proposal details below.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-2">Project Name <span className="text-red-400">*</span></label>
        <div className="relative">
          <input
            {...register('name')}
            className={cn(
              "w-full rounded-xl border bg-[#000000] px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition",
              errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-white/15 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
            )}
            placeholder="e.g. AI MedTech Solution"
          />
        </div>
        {errors.name && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.name.message}
          </p>
        )}
      </div>

      {/* Primary PPT / PDF Upload Feature (Max 10MB) */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#D4AF37]/30 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
            Upload Project File (PPT, PPTX or PDF)
          </label>
          <span className="text-xs font-extrabold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-full">
            MAX SIZE 10MB
          </span>
        </div>
        
        {pptFile ? (
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#111111] border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <FileSpreadsheet size={20} />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-white truncate">{pptFile.name}</p>
                <p className="text-xs text-gray-400">Size: {pptFile.size}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemovePpt}
              className="p-2 text-gray-400 hover:text-red-400 transition"
              title="Remove File"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#111111]/80 rounded-xl cursor-pointer transition group">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud size={26} />
            </div>
            <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition">
              Upload your Project Presentation / Document
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports PowerPoint (.ppt, .pptx) or PDF format up to 10MB</p>
            <input
              type="file"
              accept=".ppt,.pptx,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="pt-2">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-gray-700"></span> Optional Text Overview <span className="w-full h-[1px] bg-gray-700"></span>
        </p>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">Real-World Problem (Optional)</label>
          <span className="text-xs text-gray-500">{problemText?.length || 0} / 500</span>
        </div>
        <textarea
          {...register('problem')}
          rows={3}
          className={cn(
            "w-full rounded-xl border bg-[#000000] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition resize-none",
            errors.problem ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-white/10 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
          )}
          placeholder="Brief summary of the problem statement..."
        />
        {errors.problem && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.problem.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">Solution Description (Optional)</label>
          <span className="text-xs text-gray-500">{descriptionText?.length || 0} / 2000</span>
        </div>
        <textarea
          {...register('description')}
          rows={4}
          className={cn(
            "w-full rounded-xl border bg-[#000000] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition resize-none",
            errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-white/10 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
          )}
          placeholder="Brief summary of technical stack and solution..."
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.description.message}
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFDF00] text-black hover:opacity-90 py-4 font-black shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} /> Submit Project Proposal
            </>
          )}
        </button>
      </div>
    </form>
  );
}


