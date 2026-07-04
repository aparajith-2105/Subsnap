import React from "react";
import { Shield, Eye, Lock, HardDrive, CircleDollarSign, Mail, FileText, CheckCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB] gap-6" id="privacy-policy-container">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="privacy-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 text-white rounded-lg">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-[#0F172A] uppercase tracking-tight font-sans">
              SubSnap Privacy Policy
            </h1>
          </div>
          <p className="text-xs text-[#475569] font-mono uppercase tracking-widest mt-1">
            Privacy Ledger • Last updated: July 2, 2026
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-[#475569]/15 px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#0F172A] font-mono uppercase">
          <CheckCircle className="w-4 h-4 text-[#10B981]" />
          Zero-Server Database Architecture Verified
        </div>
      </div>

      {/* CORE CLAUSES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="privacy-core-clauses">
        
        {/* CLAUSE 1: DATA COLLECTION */}
        <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-4 flex flex-col justify-between" id="clause-data-collection">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-[#475569]/10 pb-3">
              <span className="text-[#0F172A] font-mono text-sm font-black bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center border border-[#475569]/20">
                01
              </span>
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider font-sans flex items-center gap-2">
                <HardDrive className="w-4 h-4" /> What Data We Collect
              </h2>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              SubSnap only processes the minimum operational data required to analyze and track your recurring subscriptions:
            </p>
            <ul className="space-y-2 text-xs text-[#0F172A]">
              <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-[#475569]/10">
                <span className="text-[#10B981] font-mono font-bold">✓</span>
                <span><strong>Uploaded Bank Statements:</strong> Raw CSV or TXT format bank statements that you choose to upload to inspect repetitive financial transaction streams.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-[#475569]/10">
                <span className="text-[#10B981] font-mono font-bold">✓</span>
                <span><strong>Manually Entered Subscription Data:</strong> Cost parameters, merchant titles, billing intervals, categories, and payment dates that you type in.</span>
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-[#475569] bg-slate-50 p-2 rounded border border-[#475569]/5 mt-4">
            REGULATORY ALIGNMENT: FTC SEC. 5 (UNFAIR/DECEPTIVE ACTS SAFEGUARD)
          </div>
        </div>

        {/* CLAUSE 2: DATA USAGE */}
        <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-4 flex flex-col justify-between" id="clause-data-usage">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-[#475569]/10 pb-3">
              <span className="text-[#0F172A] font-mono text-sm font-black bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center border border-[#475569]/20">
                02
              </span>
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider font-sans flex items-center gap-2">
                <Eye className="w-4 h-4" /> How It Is Used
              </h2>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Your private ledger information is used strictly and exclusively within your current active session:
            </p>
            <ul className="space-y-2 text-xs text-[#0F172A]">
              <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-[#475569]/10">
                <span className="text-[#10B981] font-mono font-bold">✓</span>
                <span><strong>Calculators and Estimations:</strong> To compute systemic financial subscription leakage, forgotten waste sums, and inertia latency over periods of time.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-[#475569]/10">
                <span className="text-[#10B981] font-mono font-bold">✓</span>
                <span><strong>Zero-Server Storage:</strong> Your transactional parameters are never stored on external databases or sent to our physical/cloud computing servers.</span>
              </li>
              <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-[#475569]/10">
                <span className="text-[#10B981] font-mono font-bold">✓</span>
                <span><strong>Zero Sharing Policy:</strong> SubSnap operates with high structural friction, keeping logs fully independent of any marketing syndicates or third parties.</span>
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-[#475569] bg-slate-50 p-2 rounded border border-[#475569]/5 mt-4">
            COMPLIANCE CRITERION: FTC NEGATIVE-OPTION TRANSPARENCY STANDARDS
          </div>
        </div>

        {/* CLAUSE 3: DATA STAYS LOCAL */}
        <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-4 flex flex-col justify-between" id="clause-local-processing">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-[#475569]/10 pb-3">
              <span className="text-[#0F172A] font-mono text-sm font-black bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center border border-[#475569]/20">
                03
              </span>
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider font-sans flex items-center gap-2">
                <Lock className="w-4 h-4" /> Data Stays Local
              </h2>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              We leverage browser-sandboxed sandbox protocols to secure total containment:
            </p>
            <div className="bg-slate-950 text-emerald-400 font-mono text-[11px] p-4 rounded-lg border-2 border-slate-900 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1.5 text-[9px] uppercase tracking-wider text-slate-400">
                <span>Secure Terminal</span>
                <span>Local Sandbox Mode</span>
              </div>
              <p className="text-white leading-relaxed">
                All data parsing, including uploaded statement reading and OCR receipt extraction, takes place client-side in your local browser thread. Closing your browser tab automatically wipes any transient file caches.
              </p>
              <div className="text-[10px] text-emerald-500 font-black">
                STATUS: [LOCAL_PROCESSING_ONLY]
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#475569] bg-slate-50 p-2 rounded border border-[#475569]/5 mt-4">
            INFRASTRUCTURE MODE: CLIENT-SIDE CRYPTOGRAPHIC TRUST FRAMEWORK
          </div>
        </div>

        {/* CLAUSE 4: NO DATA SOLD */}
        <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-4 flex flex-col justify-between" id="clause-no-sale">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-[#475569]/10 pb-3">
              <span className="text-[#0F172A] font-mono text-sm font-black bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center border border-[#475569]/20">
                04
              </span>
              <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider font-sans flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4" /> No Account Data Sold
              </h2>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Your financial habits belong to you alone. We firmly reject surveillance monetization:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-2 text-[#0F172A]">
              <p className="font-bold">
                SubSnap does not, and will never, sell or monetize user financial data.
              </p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                There are no tracking SDKs, no targeted advertising pixels, and no automated telemetry feeds. The software operates purely as a pro-consumer tool aimed at mitigating corporate subscription traps.
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#475569] bg-slate-50 p-2 rounded border border-[#475569]/5 mt-4">
            PRINCIPLE ETHICS: SOVEREIGN USER FINANCIAL SELF-DETERMINATION
          </div>
        </div>

      </div>

      {/* CONTACT SECTION */}
      <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-4" id="clause-contact">
        <div className="flex items-center gap-2.5 border-b border-[#475569]/10 pb-3">
          <span className="p-1.5 bg-slate-900 text-white rounded-lg">
            <Mail className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wider font-sans">
            05 • Contact Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1">
            <span className="block text-[10px] font-mono text-[#475569] uppercase font-bold">Privacy Officer</span>
            <strong className="text-[#0F172A] block font-sans">Aparajith</strong>
            <span className="text-[#475569] font-mono">Lead Compliance Engineer</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono text-[#475569] uppercase font-bold">Secure Gateway Mailbox</span>
            <strong className="text-[#0F172A] block font-mono">aparajith032@gmail.com</strong>
            <span className="text-[#475569] font-mono">General Compliance Line</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono text-[#475569] uppercase font-bold">Legal Domain</span>
            <strong className="text-[#0F172A] block font-sans">SubSnap Systems Legal Desk</strong>
            <span className="text-[#475569] font-mono">FTC Compliance and Enforcement Office</span>
          </div>
        </div>
      </div>

    </div>
  );
}
