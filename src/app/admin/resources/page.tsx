'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, FileSpreadsheet, Presentation, Calendar, HardDrive, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminResourcesPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [guideMeta, setGuideMeta] = useState<{ name: string; size: string; updatedAt: string; source: string } | null>(null);

  const fetchMetadata = async () => {
    try {
      const res = await fetch('/api/resources/guide/metadata');
      const data = await res.json();
      if (!data.error) {
        setGuideMeta(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (Max 15MB)
    const maxLimitInBytes = 15 * 1024 * 1024; 
    if (file.size > maxLimitInBytes) {
      toast.error('File size exceeds 15MB limit.');
      e.target.value = '';
      return;
    }

    // Validate type
    const validExtensions = ['.pdf', '.ppt', '.pptx'];
    const fileExt = file.name.toLowerCase();
    if (!validExtensions.some(ext => fileExt.endsWith(ext))) {
      toast.error('Only PDF, PPT, and PPTX files are allowed.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);

    try {
      let finalName = file.name;
      let finalSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      let finalDataUrl = '';

      if (fileExt.endsWith('.pdf')) {
        toast.info('Converting PDF to PPTX... This may take a moment.');
        
        // Dynamically import to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist');
        // Use CDN for worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const pptxgen = (await import('pptxgenjs')).default;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDocument = await loadingTask.promise;
        
        let pptx = new pptxgen();
        pptx.layout = 'LAYOUT_16x9';

        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext('2d');
          
          if (context) {
            await page.render({ canvasContext: context, canvas, viewport } as any).promise;
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            
            let slide = pptx.addSlide();
            slide.background = { data: imgData };
          }
        }

        const base64Data = await pptx.write({ outputType: 'base64' }) as string;
        finalDataUrl = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64Data}`;
        finalName = file.name.replace(/\.pdf$/i, '.pptx');
        
        const sizeBytes = Math.floor(base64Data.length * 0.75);
        finalSize = (sizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
      } else {
        // Handle normal PPTX upload
        finalDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch('/api/admin/resources/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          size: finalSize,
          dataUrl: finalDataUrl,
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to upload guide');
      }

      toast.success('Presentation Guide updated successfully!');
      fetchMetadata(); 
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong during conversion or upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Submission Resources</h1>
        <p className="text-gray-400">Manage downloadable resources provided to Ideathon participants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Current Guide Status */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Presentation size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Current PPT Guide</h2>
          </div>

          {guideMeta ? (
            <div className="space-y-4">
              <div className="bg-[#000000] rounded-xl p-4 border border-white/5 flex items-center gap-4">
                <FileSpreadsheet className="text-[#D4AF37]" size={24} />
                <div className="flex-1 truncate">
                  <p className="text-sm text-gray-400">File Name</p>
                  <p className="text-white font-medium truncate">{guideMeta.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#000000] rounded-xl p-4 border border-white/5 flex items-center gap-3">
                  <HardDrive className="text-gray-400" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">File Size</p>
                    <p className="text-sm text-gray-200 font-medium">{guideMeta.size}</p>
                  </div>
                </div>
                <div className="bg-[#000000] rounded-xl p-4 border border-white/5 flex items-center gap-3">
                  <Calendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-200 font-medium">
                      {new Date(guideMeta.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="/api/resources/guide" 
                  download
                  className="w-full block text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition"
                >
                  Download Current Guide
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
              <p className="text-gray-400">Loading metadata...</p>
            </div>
          )}
        </div>

        {/* Upload New Guide */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <UploadCloud size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Replace Guide</h2>
          </div>
          
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Upload a PDF, PPT, or PPTX file to replace the existing presentation guide. If you upload a PDF, the system will automatically convert it to a PowerPoint file for participants.
          </p>

          <label className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#000000] rounded-xl cursor-pointer transition group min-h-[250px]">
            {isUploading ? (
              <div className="flex flex-col items-center text-[#D4AF37]">
                <RefreshCw size={32} className="animate-spin mb-4" />
                <p className="font-bold">Processing File...</p>
                <p className="text-xs text-gray-400 mt-2">Please do not close this page</p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={30} />
                </div>
                <p className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition text-center mb-1">
                  Click to Upload Guide (PDF/PPTX)
                </p>
                <p className="text-sm text-gray-500 text-center mb-4">
                  .pdf, .ppt, or .pptx up to 15MB
                </p>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
                  Select File
                </div>
              </>
            )}
            <input
              type="file"
              accept=".ppt,.pptx"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

      </div>
    </div>
  );
}
