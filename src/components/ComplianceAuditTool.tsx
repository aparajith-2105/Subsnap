import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertOctagon, Info, Sparkles, Plus, Trash2, HelpCircle } from "lucide-react";

interface AuditCriterion {
  id: string;
  label: string;
  description: string;
  regulation: string;
  penalty: string;
}

const auditCriteria: AuditCriterion[] = [
  {
    id: "clickToCancel",
    label: "1-Click Cancellation",
    description: "Is it just as easy to cancel online as it was to sign up?",
    regulation: "FTC Click-to-Cancel Mandate",
    penalty: "$53,088 per violation daily maximum"
  },
  {
    id: "renewalReminders",
    label: "Clear Renewal Warnings",
    description: "Do they email you a reminder 3 to 7 days before charging your card?",
    regulation: "UK Consumer Rules / California Renewal Law",
    penalty: "Void contract, immediate refunds"
  },
  {
    id: "equalWeightButtons",
    label: "Fair Choice Buttons",
    description: "Are the 'Keep' and 'Cancel' buttons the same size, shape, and color so they don't trick you?",
    regulation: "EU Dark Pattern Ban",
    penalty: "Up to 6% of global annual sales"
  },
  {
    id: "transparentPricing",
    label: "No Hidden Fees",
    description: "Is the price clear and honest, with no hidden fees or unannounced price increases?",
    regulation: "FTC Junk Fee Rules",
    penalty: "Civil fines & asset freezes"
  },
  {
    id: "simpleOptOut",
    label: "No Cancel Obstacles",
    description: "Can you cancel directly without being forced to take surveys or chat with support agents?",
    regulation: "State Laws & FTC Guidelines",
    penalty: "Business operating bans"
  }
];

interface AuditedSubscription {
  id: string;
  name: string;
  checks: {
    clickToCancel: boolean;
    renewalReminders: boolean;
    equalWeightButtons: boolean;
    transparentPricing: boolean;
    simpleOptOut: boolean;
  };
  monthlyPrice: number;
  category: string;
}

const initialAuditedSubs: AuditedSubscription[] = [
  {
    id: "netflix-audit",
    name: "Netflix Premium",
    checks: {
      clickToCancel: true,
      renewalReminders: false, // Netflix rarely sends pre-billing warnings unless price changes
      equalWeightButtons: true, // Netflix uses clean side-by-side buttons
      transparentPricing: true,
      simpleOptOut: true // Interactive, no telephone or complex live agent hold
    },
    monthlyPrice: 15.49,
    category: "Entertainment"
  },
  {
    id: "spotify-audit",
    name: "Spotify Individual",
    checks: {
      clickToCancel: true,
      renewalReminders: false,
      equalWeightButtons: true,
      transparentPricing: true,
      simpleOptOut: true
    },
    monthlyPrice: 11.99,
    category: "Audio Streaming"
  },
  {
    id: "adobe-audit",
    name: "Adobe Creative Cloud",
    checks: {
      clickToCancel: false, // Adobe has been sued by FTC for hiding high early termination fees and complex cancel loops
      renewalReminders: false,
      equalWeightButtons: false, // Offers heavy steering towards annual options during cancel
      transparentPricing: false, // Surcharges on cancellation windows (early termination fee)
      simpleOptOut: false // Multi-step retention dialogues with heavy discount baiting
    },
    monthlyPrice: 54.99,
    category: "SaaS Software"
  },
  {
    id: "dashlane-audit",
    name: "Dashlane Password Mgr",
    checks: {
      clickToCancel: true,
      renewalReminders: true, // Sends reminder emails prior to renewal
      equalWeightButtons: true,
      transparentPricing: true,
      simpleOptOut: true
    },
    monthlyPrice: 4.99,
    category: "Utility"
  }
];

function DescriptiveTooltip({ text, children, position = "top", className = "inline-block" }: { text: string; children: React.ReactNode; position?: "top" | "bottom" | "left" | "right"; className?: string }) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-900"
  };

  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className={`absolute z-50 ${positionClasses[position]} w-56 p-2.5 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none font-normal normal-case leading-normal border border-slate-800`}>
        <p className="font-sans font-medium text-slate-200">{text}</p>
        <div className={`absolute border-4 border-transparent ${arrowClasses[position]}`}></div>
      </div>
    </div>
  );
}

export default function ComplianceAuditTool({ currencySymbol = "$" }: { currencySymbol?: string }) {
  const [subs, setSubs] = useState<AuditedSubscription[]>(initialAuditedSubs);
  
  // Custom subscription form state
  const [newSubName, setNewSubName] = useState("");
  const [newSubPrice, setNewSubPrice] = useState("9.99");
  const [newSubCat, setNewSubCat] = useState("Utility");
  const [newChecks, setNewChecks] = useState({
    clickToCancel: false,
    renewalReminders: false,
    equalWeightButtons: false,
    transparentPricing: false,
    simpleOptOut: false,
  });

  const calculateScore = (checks: AuditedSubscription["checks"]) => {
    const passedCount = Object.values(checks).filter(Boolean).length;
    let grade = "F";
    let colorClass = "text-red-500 border-red-500 bg-red-50";
    let desc = "Highly Predatory / Non-compliant";

    if (passedCount === 5) {
      grade = "A+";
      colorClass = "text-emerald-600 border-emerald-600 bg-emerald-50";
      desc = "Perfect Neutral Compliance (SubSnap Approved)";
    } else if (passedCount === 4) {
      grade = "B";
      colorClass = "text-green-600 border-green-600 bg-green-50";
      desc = "Minor Compliance Exposure";
    } else if (passedCount === 3) {
      grade = "C";
      colorClass = "text-amber-500 border-amber-500 bg-amber-50";
      desc = "Moderate Risk / Minor Dark Patterns Present";
    } else if (passedCount === 2) {
      grade = "D";
      colorClass = "text-orange-500 border-orange-500 bg-orange-50";
      desc = "Serious Compliance Deviations";
    }

    return { grade, colorClass, desc, passedCount };
  };

  const handleToggleCheck = (subId: string, checkKey: keyof AuditedSubscription["checks"]) => {
    setSubs(prev => prev.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          checks: {
            ...s.checks,
            [checkKey]: !s.checks[checkKey]
          }
        };
      }
      return s;
    }));
  };

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newAudit: AuditedSubscription = {
      id: `custom-audit-${Date.now()}`,
      name: newSubName,
      monthlyPrice: parseFloat(newSubPrice) || 0,
      category: newSubCat,
      checks: { ...newChecks }
    };

    setSubs(prev => [newAudit, ...prev]);
    setNewSubName("");
    setNewSubPrice("9.99");
    setNewSubCat("Utility");
    setNewChecks({
      clickToCancel: false,
      renewalReminders: false,
      equalWeightButtons: false,
      transparentPricing: false,
      simpleOptOut: false,
    });
  };

  const handleDeleteAudit = (id: string) => {
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB] gap-6" id="compliance-audit-container">
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-lg border-2 border-[#0F172A] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500 animate-pulse" />
            <h3 className="text-sm font-mono uppercase tracking-widest font-black text-emerald-400">Fairness Checker</h3>
          </div>
          <h2 className="text-2xl font-black tracking-tight">SUBSCRIPTION FAIRNESS GRADE CHECKER</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 max-w-2xl leading-relaxed">
            Check if your subscriptions use fair, legal practices. Score them based on whether they make it easy to cancel or if they try to trick you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Audit Form (Left 4 cols) */}
        <div className="xl:col-span-4 bg-white border-2 border-slate-900 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#475569]/10">
            <Plus className="w-5 h-5 text-[#0F172A] shrink-0" />
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#0F172A]">
              Check a Subscription
            </h3>
          </div>

          <form onSubmit={handleCreateAudit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[10px] font-bold font-mono uppercase text-[#475569] mb-1">
                Merchant / Service Name
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Paramount+ Monthly"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold text-[#0F172A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold font-mono uppercase text-[#475569] mb-1">
                  Monthly Price ({currencySymbol})
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="9.99"
                  value={newSubPrice}
                  onChange={e => setNewSubPrice(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold text-[#0F172A] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono uppercase text-[#475569] mb-1">
                  Category
                </label>
                <select
                  value={newSubCat}
                  onChange={e => setNewSubCat(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold text-[#0F172A] outline-none"
                >
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utility">Utility</option>
                  <option value="SaaS Software">SaaS Software</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="SaaS Widget">SaaS Widget</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-[#475569]/10">
              <span className="block text-[10px] font-black font-mono uppercase text-[#475569] mb-2">
                Compliance Criteria Checklists
              </span>

              <div className="flex flex-col gap-2">
                {auditCriteria.map(criterion => (
                  <label 
                    key={criterion.id} 
                    className="flex items-start gap-2.5 p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer transition-all"
                  >
                    <input 
                      type="checkbox"
                      checked={(newChecks as any)[criterion.id]}
                      onChange={() => setNewChecks(prev => ({
                        ...prev,
                        [criterion.id]: !(prev as any)[criterion.id]
                      }))}
                      className="mt-0.5 w-4 h-4 accent-slate-900 rounded"
                    />
                    <div className="flex-1">
                      <span className="block text-[10px] font-black text-[#0F172A] leading-tight">
                        {criterion.label}
                      </span>
                      <span className="block text-[8px] font-mono text-slate-500 mt-0.5">
                        {criterion.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <DescriptiveTooltip 
              text="Analyzes the subscription based on FTC guidelines, renewal transparency, and ease of cancellation to calculate an objective Fairness Grade." 
              position="top"
              className="w-full block"
            >
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-[10px] font-mono font-black uppercase tracking-widest rounded-lg transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check Subscription Fairness</span>
              </button>
            </DescriptiveTooltip>
          </form>
        </div>

        {/* Existing Audit Cards (Right 8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#475569]">
              Saved Fairness Scores ({subs.length})
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#475569]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Completely Fair (A+)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 ml-2"></span>
              <span>Very Tricky (F)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subs.map(sub => {
              const { grade, colorClass, desc, passedCount } = calculateScore(sub.checks);
              return (
                <div 
                  key={sub.id} 
                  className="bg-white border-2 border-slate-900 rounded-lg p-5 flex flex-col justify-between gap-4 relative overflow-hidden shadow-sm"
                >
                  {/* Delete button */}
                  <button 
                    onClick={() => handleDeleteAudit(sub.id)}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 transition-colors"
                    title="Delete Audit record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    {/* Header line */}
                    <div className="flex items-center gap-2 mb-1 pr-6">
                      <span className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded border text-[#475569]">
                        {sub.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {currencySymbol}{sub.monthlyPrice.toFixed(2)}/mo
                      </span>
                    </div>

                    <h4 className="text-base font-black tracking-tight text-[#0F172A] mb-3">
                      {sub.name}
                    </h4>

                    {/* Grade indicator */}
                    <div className={`p-3 border-2 rounded-lg flex items-center justify-between mb-4 ${colorClass}`}>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono uppercase tracking-wider opacity-80 leading-none">
                          Fairness Score
                        </span>
                        <span className="text-xs font-black tracking-tight mt-0.5 font-sans leading-none">
                          {desc}
                        </span>
                      </div>
                      <span className="text-2xl font-black font-mono leading-none tracking-tighter">
                        {grade}
                      </span>
                    </div>

                    {/* Check items */}
                    <div className="flex flex-col gap-2">
                      {auditCriteria.map(criterion => {
                        const passed = (sub.checks as any)[criterion.id];
                        return (
                          <div 
                            key={criterion.id}
                            onClick={() => handleToggleCheck(sub.id, criterion.id as any)}
                            className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${
                              passed ? "bg-emerald-50/40 hover:bg-emerald-50" : "bg-red-50/20 hover:bg-red-50/40"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              )}
                              <span className="text-[10px] font-bold text-slate-700">
                                {criterion.label}
                              </span>
                            </div>
                            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                              passed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              {passed ? "COMPLIANT" : "FAIL"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Criteria info box on fail */}
                  {passedCount < 5 && (
                    <div className="p-3 bg-red-50/30 border border-red-100 rounded-lg mt-1">
                      <div className="flex items-center gap-1.5 text-red-800 mb-1">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[9px] font-mono uppercase tracking-wider font-bold">
                          Tricky Tactics Detected
                        </span>
                      </div>
                      <p className="text-[10px] text-red-950 font-sans leading-tight">
                        This subscription uses tricks that go against government fairness rules (like the FTC Click-to-Cancel rule), which make it hard for you to cancel.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
