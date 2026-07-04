import React, { useState, useEffect } from "react";

interface MerchantLogoProps {
  name: string;
  logoLetter: string;
  logoUrl?: string;
  className?: string;
}

export default function MerchantLogo({ name, logoLetter, logoUrl, className = "w-10 h-10" }: MerchantLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error when logoUrl changes (e.g. on new detections)
  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  const colors = [
    "bg-[#0f172a] text-slate-100 border border-slate-800",
    "bg-[#ef4444] text-white border border-[#ef4444]",
    "bg-[#3b82f6] text-white border border-[#3b82f6]",
    "bg-[#10b981] text-[#0f172a] border border-[#10b981]",
    "bg-[#6366f1] text-white border border-[#6366f1]",
    "bg-[#a855f7] text-white border border-[#a855f7]",
    "bg-[#f59e0b] text-[#0f172a] border border-[#f59e0b]",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  const colorClass = colors[index];

  if (logoUrl && !hasError) {
    return (
      <div className={`${className} rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white border border-[#475569]/30 shadow-sm relative`}>
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-1.5"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${className} ${colorClass} rounded-lg shrink-0 flex items-center justify-center font-extrabold text-sm select-none`}>
      {logoLetter}
    </div>
  );
}
