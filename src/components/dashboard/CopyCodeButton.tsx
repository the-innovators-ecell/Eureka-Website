'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      onClick={handleCopy}
      className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
      aria-label="Copy code"
    >
      {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
    </button>
  );
}
