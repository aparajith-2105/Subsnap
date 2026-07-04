import React, { useState } from "react";
import { Scale, ShieldAlert, Award, Calculator, TrendingUp, AlertTriangle, ExternalLink } from "lucide-react";

interface LegalCase {
  id: string;
  defendant: string;
  fineAmount: string;
  regulator: string;
  year: number;
  infraction: string;
  consequences: string;
  citation: string;
  severity: "CRITICAL" | "HIGH";
}

const realCases: LegalCase[] = [
  {
    id: "amazon-prime",
    defendant: "Amazon Inc.",
    fineAmount: "Pending Multibillion Remediation",
    regulator: "Federal Trade Commission (FTC)",
    year: 2023,
    infraction: "Forcing users through the notorious 'Iliad Flow' - a multi-step, deliberately confusing cancel process consisting of 6 separate screens of options and warning blocks while signing up was single-click.",
    consequences: "Forced restructuring of prime global exit flows, public censure, and ongoing consumer restitution hearings scaling towards billions in legal reserves.",
    citation: "FTC v. Amazon.com, Inc. Case No. 2:23-cv-00934 (W.D. Wash.)",
    severity: "CRITICAL"
  },
  {
    id: "vonage",
    defendant: "Vonage Holdings",
    fineAmount: "$100,000,000",
    regulator: "Federal Trade Commission (FTC)",
    year: 2022,
    infraction: "Charging continuous hidden fees and building massive administrative loops. Requires online enrollments but forced users to navigate restricted telephone queues to terminate membership.",
    consequences: "$100 Million fine allocated strictly for direct consumer refunds. Ordered to permanently cease all phone-only cancellation requirements.",
    citation: "FTC v. Vonage, Case No. 3:22-cv-06435 (D.N.J.)",
    severity: "CRITICAL"
  },
  {
    id: "care-com",
    defendant: "Care.com",
    fineAmount: "$8,500,000",
    regulator: "Federal Trade Commission (FTC)",
    year: 2024,
    infraction: "Employing deceptive forced-continuity free-trial traps and failing to provide upfront simple cancellation. Hidden automated rollover charging without active re-consent.",
    consequences: "$8.5 Million settlement, mandated simple cancellation links, and strict warning notifications 3 days before any card rollover is initiated.",
    citation: "FTC v. Care.com, Inc. Case No. 1:24-cv-11201 (D. Mass.)",
    severity: "HIGH"
  },
  {
    id: "google-cookies",
    defendant: "Google LLC",
    fineAmount: "€150,000,000",
    regulator: "CNIL (French Data Protection Authority)",
    year: 2022,
    infraction: "Creating asymmetric interfaces where rejecting tracking cookies required several steps and dense sub-menus, while accepting tracking was completed via 1-click.",
    consequences: "€150 Million primary fine, and €100,000 daily delay penalty until single-click equal-weight refusal controls were deployed.",
    citation: "CNIL Sanction Decision No. SAN-2021-024",
    severity: "HIGH"
  },
  {
    id: "epic-games",
    defendant: "Epic Games Inc.",
    fineAmount: "$245,000,000",
    regulator: "Federal Trade Commission (FTC)",
    year: 2023,
    infraction: "Using deceptive dark patterns, visual misdirection, and trick buttons to trigger unintended recurring micro-transaction purchases and subscriptions inside games without express parental consent.",
    consequences: "$245 Million customer refund mandate, the largest administrative settlement in FTC gaming history, and strict double-confirmation opt-ins.",
    citation: "FTC v. Epic Games, Case No. 3:22-cv-00125 (E.D.N.C.)",
    severity: "CRITICAL"
  }
];

export default function RegulatoryTracker({ currencySymbol = "$" }: { currencySymbol?: string }) {
  const [selectedCase, setSelectedCase] = useState<LegalCase>(realCases[0]);
  
  // Interactive FTC fine calculator state
  const [violatingUsers, setViolatingUsers] = useState("100");
  const [violationDays, setViolationDays] = useState("30");
  const statutoryRate = 53088; // FTC standard violation limit per occurrence per day

  const calculatedFine = (parseInt(violatingUsers) || 0) * (parseInt(violationDays) || 0) * statutoryRate;

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB] gap-6" id="regulatory-tracker-container">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-lg border-2 border-[#0F172A] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="text-sm font-mono uppercase tracking-widest font-black text-amber-400">Court Records</h3>
          </div>
          <h2 className="text-2xl font-black tracking-tight">COMPANY LITIGATION & FINES TRACKER</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 max-w-2xl leading-relaxed">
            Real records of big companies fined for using tricky sign-up or cancel tricks. Use our fine calculator to see how much companies are fined by law when they make it hard to cancel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cases Grid List (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#475569]">
            Famous Legal Cases ({realCases.length})
          </h3>

          <div className="flex flex-col gap-3">
            {realCases.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                    isSelected 
                      ? "border-slate-900 bg-slate-900 text-white shadow-md" 
                      : "border-slate-200 bg-white text-[#0F172A] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600 border"
                      }`}>
                        {c.regulator}
                      </span>
                      <h4 className="text-lg font-black tracking-tight mt-1">
                        {c.defendant}
                      </h4>
                    </div>
                    <span className={`text-sm font-mono font-black tracking-tight px-3 py-1 rounded border-2 ${
                      isSelected 
                        ? "text-amber-400 border-amber-400/40 bg-slate-950" 
                        : "text-red-600 border-red-600/30 bg-red-50/50"
                    }`}>
                      {c.fineAmount}
                    </span>
                  </div>

                  <p className={`text-xs mt-3 line-clamp-2 leading-relaxed ${
                    isSelected ? "text-slate-300" : "text-[#475569]"
                  }`}>
                    {c.infraction}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#475569]/10 flex items-center justify-between text-[9px] font-mono">
                    <span className={isSelected ? "text-slate-400" : "text-[#475569]"}>
                      Citation: {c.citation.substring(0, 42)}...
                    </span>
                    <span className="font-bold flex items-center gap-1">
                      Case File <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Case details & FTC Fine Calculator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Detailed case preview */}
          {selectedCase && (
            <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm flex flex-col gap-4">
              <div className="border-b pb-3 border-[#475569]/10">
                <span className="text-[9px] font-mono uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded border font-bold">
                  CASE OVERVIEW
                </span>
                <h4 className="text-lg font-black tracking-tight text-[#0F172A] mt-2">
                  {selectedCase.defendant} vs. {selectedCase.regulator}
                </h4>
                <p className="text-[10px] font-mono text-[#475569] mt-0.5">
                  Year of Case: {selectedCase.year}
                </p>
              </div>

              <div>
                <span className="block text-[10px] font-bold font-mono text-[#475569] uppercase tracking-wider mb-1">
                  What the company did wrong
                </span>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
                  {selectedCase.infraction}
                </p>
              </div>

              <div>
                <span className="block text-[10px] font-bold font-mono text-[#475569] uppercase tracking-wider mb-1">
                  The Fine and Punishment
                </span>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {selectedCase.consequences}
                </p>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-lg text-white border border-slate-950">
                <div className="flex items-center gap-2 mb-1 text-amber-400">
                  <Award className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                    Total Fine Amount
                  </span>
                </div>
                <p className="text-xl font-mono font-black text-amber-300">
                  {selectedCase.fineAmount}
                </p>
                <p className="text-[9px] font-mono text-slate-400 mt-1">
                  {selectedCase.citation}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic FTC Fine Calculator */}
          <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#475569]/10">
              <Calculator className="w-5 h-5 text-red-600 shrink-0" />
              <h4 className="text-xs font-mono font-black uppercase tracking-wider text-[#0F172A]">
                Government Fine Calculator
              </h4>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed font-sans">
              By law, the government can fine companies up to <strong className="font-mono text-[#0F172A]">{currencySymbol}{statutoryRate.toLocaleString()}</strong> per violation, per day, for using tricky signup tactics or subscription traps. See how quickly fines add up:
            </p>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-[#475569] mb-1">
                  Number of Tricked Users
                </label>
                <input 
                  type="number" 
                  value={violatingUsers}
                  onChange={e => setViolatingUsers(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-mono font-black text-[#0F172A] outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-[#475569] mb-1">
                  Number of Days Billed
                </label>
                <input 
                  type="number" 
                  value={violationDays}
                  onChange={e => setViolationDays(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-mono font-black text-[#0F172A] outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-950 flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-1 text-red-700">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[10px] font-black font-mono uppercase">
                  Estimated Government Fine Amount
                </span>
              </div>
              <p className="text-2xl font-mono font-black text-red-600 tracking-tight">
                {currencySymbol}{calculatedFine.toLocaleString()}
              </p>
              <p className="text-[9px] font-mono text-red-800 leading-snug">
                How this is calculated: {violatingUsers || "0"} users x {violationDays || "0"} days x {currencySymbol}{statutoryRate.toLocaleString()} fine rate per day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
