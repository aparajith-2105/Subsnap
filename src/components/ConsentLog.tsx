import React, { useState } from "react";
import { FileText, Plus, Trash2, CheckCircle, Search, ShieldCheck, Download, AlertCircle } from "lucide-react";

interface ConsentRecord {
  id: string;
  merchant: string;
  tier: string;
  consentDate: string;
  hashSignature: string;
  proofCode: string;
  retainsPeriodYears: number;
}

const initialRecords: ConsentRecord[] = [
  {
    id: "consent-1",
    merchant: "Netflix Premium",
    tier: "Ultra HD",
    consentDate: "2026-04-15",
    hashSignature: "SHA256-e9b40f82df918a38c29011de...",
    proofCode: "MOC-NFT-9204",
    retainsPeriodYears: 3
  },
  {
    id: "consent-2",
    merchant: "Spotify Premium",
    tier: "Family Plan",
    consentDate: "2026-05-10",
    hashSignature: "SHA256-9a2c3d5e8f0b1a2c3d4e5f6...",
    proofCode: "MOC-SPT-1152",
    retainsPeriodYears: 3
  },
  {
    id: "consent-3",
    merchant: "Dashlane Password Manager",
    tier: "Premium Individual",
    consentDate: "2026-06-01",
    hashSignature: "SHA256-ff7a8b9c0d1e2f3a4b5c6d7...",
    proofCode: "MOC-DSH-8840",
    retainsPeriodYears: 3
  }
];

export default function ConsentLog() {
  const [records, setRecords] = useState<ConsentRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form states
  const [merchant, setMerchant] = useState("");
  const [tier, setTier] = useState("Standard Plan");
  const [consentDate, setConsentDate] = useState("2026-06-30");
  const [proofCode, setProofCode] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAddConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !isAgreed) return;

    // Simulate cryptographic hash generation representing proof
    const simulatedHash = `SHA256-${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...`;
    
    const newRecord: ConsentRecord = {
      id: `consent-${Date.now()}`,
      merchant,
      tier,
      consentDate,
      hashSignature: simulatedHash,
      proofCode: proofCode || `MOC-${merchant.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      retainsPeriodYears: 3
    };

    setRecords(prev => [newRecord, ...prev]);
    setMerchant("");
    setTier("Standard Plan");
    setConsentDate("2026-06-30");
    setProofCode("");
    setIsAgreed(false);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleDownloadProof = (record: ConsentRecord) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SubSnap_Consent_${record.merchant.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredRecords = records.filter(r => 
    r.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.proofCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB] gap-6" id="consent-log-container">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-lg border-2 border-[#0F172A] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-[#10B981] animate-pulse" />
            <h3 className="text-sm font-mono uppercase tracking-widest font-black text-[#10B981]">Receipt Archive</h3>
          </div>
          <h2 className="text-2xl font-black tracking-tight">YOUR SIGNUP AGREEMENTS & RECEIPTS</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 max-w-2xl leading-relaxed">
            Save receipts and agreements for when you signed up for subscriptions. This gives you clear proof to dispute surprise charges or uninvited renewals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Log Consent Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#475569]/10">
            <Plus className="w-5 h-5 text-[#0F172A] shrink-0" />
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#0F172A]">
              Save a Signup Receipt
            </h3>
          </div>

          <form onSubmit={handleAddConsent} className="flex flex-col gap-3">
            <div>
              <label className="block text-[10px] font-bold font-mono uppercase text-[#475569] mb-1">
                Merchant / Platform Name
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Disney+ Yearly"
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold text-[#0F172A] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono uppercase text-[#475569] mb-1">
                Subscription Tier / Level
              </label>
              <input 
                type="text" 
                placeholder="e.g. Premium Family Account"
                value={tier}
                onChange={e => setTier(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold text-[#0F172A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold font-mono uppercase text-[#475569] mb-1">
                  Consent Date
                </label>
                <input 
                  type="date" 
                  value={consentDate}
                  onChange={e => setConsentDate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-[#0F172A] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono uppercase text-[#475569] mb-1">
                  Confirmation Code (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. TXN-10492"
                  value={proofCode}
                  onChange={e => setProofCode(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-[#0F172A] outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-amber-950 mt-1 flex flex-col gap-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isAgreed}
                  onChange={e => setIsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-slate-900 cursor-pointer"
                />
                <span className="text-[10px] leading-tight text-amber-900 font-sans">
                  I confirm that I willingly signed up for this recurring subscription and saw the terms clearly.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isAgreed}
              className="w-full py-2.5 bg-[#0F172A] disabled:opacity-50 hover:bg-slate-800 text-white text-[10px] font-mono font-black uppercase tracking-widest rounded-lg transition-all shadow-md mt-2"
            >
              Save to Receipt Log
            </button>
          </form>
        </div>

        {/* Existing Logs Display (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2 border-slate-200">
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#475569]">
              Saved Signup Receipts ({records.length})
            </h3>
            <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
              RECOMMENDED TO KEEP: 3 YEARS
            </span>
          </div>

          <div className="flex items-center gap-2 border-2 border-slate-900 px-3 py-2 rounded-lg bg-slate-50">
            <Search className="w-4 h-4 text-[#475569] shrink-0" />
            <input 
              type="text" 
              placeholder="Search evidence records by merchant or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-[#0F172A] placeholder-[#475569] outline-none w-full"
            />
          </div>

          <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic text-xs">
                No consent logs registered.
              </div>
            ) : (
              filteredRecords.map(record => (
                <div 
                  key={record.id}
                  className="bg-white border-2 border-slate-900 rounded-lg p-4 flex flex-col justify-between gap-3 shadow-sm relative overflow-hidden"
                >
                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-emerald-600 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-base font-black tracking-tight text-[#0F172A]">
                        {record.merchant}
                      </h4>
                      <p className="text-[10px] font-mono text-[#475569] mt-0.5">
                        Tier Level: <strong className="font-bold text-slate-900">{record.tier}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border rounded-lg font-mono text-[9px] text-slate-500 flex flex-col gap-1.5 mt-1">
                    <div className="flex justify-between">
                      <span>CONSENT DATE:</span>
                      <span className="font-bold text-[#0F172A]">{record.consentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CONFIRMATION CODE:</span>
                      <span className="font-bold text-emerald-600">{record.proofCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RECEIPT SECURITY CODE:</span>
                      <span className="font-bold text-[#0F172A] max-w-[180px] truncate">{record.hashSignature}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#475569] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      3-Year Recommended Record
                    </span>
                    <button
                      onClick={() => handleDownloadProof(record)}
                      className="text-[9px] font-mono font-bold text-slate-900 hover:underline uppercase flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200"
                    >
                      Export receipt <Download className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
