import React from "react";
import { 
  Shield, 
  Eye, 
  Lock, 
  HardDrive, 
  Mail, 
  CheckCircle, 
  KeyRound,
  FileSpreadsheet,
  Webhook,
  Activity,
  UserCheck
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex-1 flex flex-col p-6 bg-[#0B0F19] text-[#F8FAFC] gap-6 rounded-xl border border-slate-800/80 shadow-2xl" id="privacy-policy-container">
      
      {/* HEADER HERO SECTION */}
      <div className="relative bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-8 rounded-xl border border-[#14B8A6]/20 overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6" id="privacy-header">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6]/5 rounded-full blur-3xl -z-10"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#14B8A6]/10 text-[#14B8A6] rounded-lg border border-[#14B8A6]/20">
              <Shield className="w-6 h-6 animate-pulse" />
            </span>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
              SubSnap Privacy Policy
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">
            Privacy Control Ledger • Last updated: July 12, 2026
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-900/80 border border-[#14B8A6]/35 px-4 py-2 rounded-lg text-xs font-bold text-[#14B8A6] font-mono uppercase shadow-inner">
          <CheckCircle className="w-4.5 h-4.5 text-[#14B8A6]" />
          Zero-Server Financial Storage Architecture Verified
        </div>
      </div>

      {/* COMPLIANCE DISCLOSURE NOTICE */}
      <div className="bg-[#0F172A] border border-slate-800/80 p-4 rounded-lg flex items-start gap-3">
        <UserCheck className="w-5 h-5 text-[#14B8A6] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">FTC Compliance Disclosure Statement</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            In compliance with FTC guidance for negative-option subscription models and consumer protection standards, SubSnap is engineered as a secure, decentralized utility. No personal login is required to inspect this document, and all statement analysis remains fully client-side.
          </p>
        </div>
      </div>

      {/* CORE CLAUSES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="privacy-core-clauses">
        
        {/* SECTION 1: WHAT DATA WE COLLECT */}
        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-[#14B8A6]/30 transition-all duration-300 shadow-md group" id="clause-data-collection">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <span className="text-[#14B8A6] font-mono text-sm font-black bg-[#14B8A6]/10 w-8 h-8 rounded-full flex items-center justify-center border border-[#14B8A6]/20">
                01
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#14B8A6]" /> What Data We Collect
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SubSnap adheres to data-minimization design principles. We process only the minimum operational parameters required to analyze recurring billing streams:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <FileSpreadsheet className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Uploaded Bank Statements:</strong>
                  <span className="text-slate-400 text-[11px]">CSV or text-based financial files uploaded by the user are parsed and processed locally in-browser. They are <strong>never</strong> transmitted to or stored on our servers.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <Shield className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Manually Entered Subscription Data:</strong>
                  <span className="text-slate-400 text-[11px]">Cost figures, billing frequencies, merchant titles, and renewal date overrides input directly by the user into the local database.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <Webhook className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Cancellation Webhook Logs:</strong>
                  <span className="text-slate-400 text-[11px]">Consent revocation events and subscription cancel requests transmitted securely to the configured external webhook (e.g. n8n workflow pipeline) for user automation.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2.5 rounded border border-slate-800/50 mt-4 uppercase tracking-widest">
            REGULATORY MARK: SECURE COLLECTION AUDIT PATH
          </div>
        </div>

        {/* SECTION 2: HOW DATA IS USED */}
        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-[#14B8A6]/30 transition-all duration-300 shadow-md group" id="clause-data-usage">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <span className="text-[#14B8A6] font-mono text-sm font-black bg-[#14B8A6]/10 w-8 h-8 rounded-full flex items-center justify-center border border-[#14B8A6]/20">
                02
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#14B8A6]" /> How Data Is Used
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The processing of your recurring ledger data is restricted strictly to customer-initiated optimization actions:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <Activity className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Leakage Metric Computation:</strong>
                  <span className="text-slate-400 text-[11px]">Calculating active subscription leakage, dormant software cost spikes, and cumulative monthly waste totals strictly inside the localized client dashboard.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <CheckCircle className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">FTC Compliance Audit Trails:</strong>
                  <span className="text-slate-400 text-[11px]">Generating structured consent-history records and unilateral cancel requests to establish a formal compliance paper trail verifying the legal request to stop billing.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <Lock className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Strict Privacy & No Third-Party Sales:</strong>
                  <span className="text-slate-400 text-[11px]">We never sell, rent, license, trade, or distribute your subscription habits or financial data to data-brokers, publishers, or ad networks. Data stays exclusively yours.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2.5 rounded border border-slate-800/50 mt-4 uppercase tracking-widest">
            OPERATIONAL BOUNDARY: ZERO MARKETING SYNDICATION
          </div>
        </div>

        {/* SECTION 3: GMAIL ACCESS PROTOCOL */}
        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-[#14B8A6]/30 transition-all duration-300 shadow-md group" id="clause-gmail-access">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <span className="text-[#14B8A6] font-mono text-sm font-black bg-[#14B8A6]/10 w-8 h-8 rounded-full flex items-center justify-center border border-[#14B8A6]/20">
                03
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#14B8A6]" /> Google OAuth & Gmail Access
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you opt-in to link Google Workspace to SubSnap, we handle your API communication using secure, restricted credentials:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <Lock className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Send-Only Permissions:</strong>
                  <span className="text-slate-400 text-[11px]">SubSnap requests the restricted <code>gmail.send</code> scope exclusively. This authorization allows the system only to programmatically dispatch emails.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <Mail className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Exclusively Self-Alerting Notifications:</strong>
                  <span className="text-slate-400 text-[11px]">The Gmail API access token is used exclusively to dispatch renewal hazard digests, cost spike warning alerts, and upcoming debit alerts <strong>to your own registered inbox</strong>.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-[#0F172A] p-3 rounded border border-slate-800">
                <Shield className="w-4.5 h-4.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Zero Reading, Storage, or Sharing:</strong>
                  <span className="text-slate-400 text-[11px]">SubSnap has <strong>no permissions to read</strong>, fetch, compile, scan, index, analyze, store, or share your incoming or outgoing mailbox emails. Your inbox contents remain completely private.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2.5 rounded border border-slate-800/50 mt-4 uppercase tracking-widest">
            SCOPE CLEARANCE: GMAIL.SEND RESTRICTED PROTOCOL
          </div>
        </div>

        {/* SECTION 4: DATA STAYS LOCAL */}
        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-[#14B8A6]/30 transition-all duration-300 shadow-md group" id="clause-local-only">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <span className="text-[#14B8A6] font-mono text-sm font-black bg-[#14B8A6]/10 w-8 h-8 rounded-full flex items-center justify-center border border-[#14B8A6]/20">
                04
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#14B8A6]" /> Local Storage Guarantee
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We leverage modern browser isolation mechanics to shield sensitive financial details from external network exposure:
            </p>
            
            <div className="bg-slate-950 text-teal-400 font-mono text-[11px] p-4 rounded-lg border border-[#14B8A6]/30 space-y-2 shadow-inner">
              <div className="flex justify-between border-b border-slate-800 pb-1.5 text-[9px] uppercase tracking-wider text-slate-500">
                <span>Cryptographic Trust</span>
                <span>Client Sandbox Thread</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#14B8A6]">●</span>
                  <span><strong>Client-Side Engine:</strong> Raw statement parsing and receipts rendering occur entirely inside your browser's VM thread.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#14B8A6]">●</span>
                  <span><strong>No Raw Credentials Stored:</strong> Absolute suppression of any raw banking login, token keys, or password credentials.</span>
                </li>
                <li className="flex items-center gap-2 text-teal-400 font-bold">
                  <span className="animate-ping">●</span>
                  <span>ACTIVE SECURITY STATUS: LOCALIZED</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-2.5 rounded border border-slate-800/50 mt-4 uppercase tracking-widest">
            SANDBOX PROTECTION: TOTAL BROWSER ENCLAVE ISOLATION
          </div>
        </div>

      </div>

      {/* SECTION 5: CONTACT INFORMATION */}
      <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4 hover:border-[#14B8A6]/30 transition-all duration-300" id="clause-contact">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <span className="p-2 bg-[#14B8A6]/10 text-[#14B8A6] rounded-lg border border-[#14B8A6]/20">
            <Mail className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-black text-white uppercase tracking-wider font-sans">
            05 • Inquiries and Contact Information
          </h2>
        </div>
        
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          If you have any questions, regulatory compliance suggestions, or concerns regarding your local session ledger data, please submit your inquiry to our secure compliance mailbox. We are committed to transparency and consumer advocacy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-2">
          <div className="space-y-1 bg-[#0F172A] p-3.5 rounded border border-slate-800">
            <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Privacy Officer Desk</span>
            <strong className="text-white block font-sans">Aparajith</strong>
            <span className="text-[#14B8A6] font-mono text-[10px]">Lead Compliance and Integrity Engineer</span>
          </div>
          <div className="space-y-1 bg-[#0F172A] p-3.5 rounded border border-slate-800">
            <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Secure Gateway Mailbox</span>
            <strong className="text-white block font-mono text-[13px] text-teal-400">aparajith032@gmail.com</strong>
            <span className="text-slate-500 font-mono text-[10px]">Primary Inbound Line</span>
          </div>
          <div className="space-y-1 bg-[#0F172A] p-3.5 rounded border border-[#14B8A6]/10">
            <span className="block text-[10px] font-mono text-slate-500 uppercase font-bold">Legal Domain Authority</span>
            <strong className="text-white block font-sans">SubSnap Systems Legal Desk</strong>
            <span className="text-slate-500 font-mono text-[10px]">FTC compliance enforcement coordination</span>
          </div>
        </div>
      </div>

    </div>
  );
}
