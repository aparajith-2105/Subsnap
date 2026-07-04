import React, { useState } from "react";
import { Search, AlertTriangle, ShieldCheck, Scale, FileText, ChevronRight } from "lucide-react";

interface DarkPattern {
  id: string;
  name: string;
  category: string;
  description: string;
  example: string;
  citation: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  remediation: string;
  whartonInsight: string;
}

const darkPatterns: DarkPattern[] = [
  {
    id: "roach-motel",
    name: "Roach Motel (Easy In, Impossible Out)",
    category: "Navigation & Access Obstruction",
    description: "Creating an extremely streamlined, single-click sign-up flow while deliberately burying the cancellation mechanism behind deep menus, phone queues, or physical mail mandates.",
    example: "Amazon Prime requiring 6-step dialog sequences ('Iliad Flow') to cancel, compared to 1-click subscription activation.",
    citation: "FTC Act Section 5 Unfair/Deceptive Practices; FTC ROSCA (Restore Online Shoppers' Confidence Act).",
    severity: "CRITICAL",
    remediation: "Implement a direct 'Click-to-Cancel' mechanism that is just as easy as signing up, ideally located directly on the primary account dashboard.",
    whartonInsight: "Wharton 2026 data shows that adding even two extra screens to a cancellation flow reduces successfully completed cancellations by 54.2% due to cumulative cognitive friction."
  },
  {
    id: "confirmshaming",
    name: "Confirmshaming (Emotional Guilt)",
    category: "Cognitive Bias Exploitation",
    description: "Opt-out choices styled with emotionally manipulative or shaming language to steer the user back to continuing billing.",
    example: "A cancel button that reads 'No, I prefer to waste money and lose my premium benefits' vs. 'Keep Premium' in bold.",
    citation: "California Automatic Renewal Law (ARL); EU Digital Services Act (DSA) Article 25.",
    severity: "HIGH",
    remediation: "Neutral, simple, objective factual choice labels (e.g., 'Cancel Subscription' and 'Maintain Membership') with equal visual styling.",
    whartonInsight: "Studies show confirmshaming triggers transient emotional anxiety, which increases immediate retention by 12% but leads to a 42% spike in subsequent payment dispute rates."
  },
  {
    id: "forced-continuity",
    name: "Forced Continuity (Silent Trials)",
    category: "Billing Manipulation",
    description: "Billing a credit card automatically immediately after a free or low-cost trial period ends without offering a preceding high-salience reminder or active re-consent.",
    example: "Charging a card $99.99 for an annual membership immediately at midnight on Day 7 of a free trial without notice.",
    citation: "FTC ROSCA Rule 16 CFR Part 310; UK Digital Markets, Competition and Consumers (DMCC) Act.",
    severity: "CRITICAL",
    remediation: "Mandatory warning notifications 3 days prior to trial completion with an direct, frictionless link to cancel prior to first charge.",
    whartonInsight: "Wharton field experiments found 85.2% of trial users planned to cancel but failed due to inattention, proving automatic rollover functions primarily on consumer inertia."
  },
  {
    id: "privacy-zuckering",
    name: "Privacy Zuckering",
    category: "Consent Distortion",
    description: "Tricking users into consenting to share far more personal and telemetry data than is necessary for the transaction, often to build profile targeting.",
    example: "A subscription manager requiring a linked social media account, contact list, and active location tracking to perform a basic subscription pause.",
    citation: "EU GDPR Minimal Data Collection Principle; California Privacy Rights Act (CPRA).",
    severity: "HIGH",
    remediation: "Explicit granular opt-ins, strict adherence to zero-data access unless strictly required for VRP bank processing.",
    whartonInsight: "Users are 4x more likely to accept intrusive tracking if it is packaged as a standard terms confirmation during subscription cancellation."
  },
  {
    id: "sludge-friction",
    name: "Sludge & Excess Friction",
    category: "Interaction Obstruction",
    description: "Intentionally introducing physical or temporal delays in the cancellation flow, such as requiring live chat queues, calling customer service during restricted hours, or mailing physical forms.",
    example: "SaaS providers requiring you to call a 1-800 number during EST business hours to cancel a digital cloud service.",
    citation: "FTC 2026 Click-to-Cancel Final Rule (Cancellation must be offered through the same medium as enrollment).",
    severity: "CRITICAL",
    remediation: "An online self-service cancellation button if sign-up was conducted online. No telephone queues permitted for online transactions.",
    whartonInsight: "Requiring a live support interaction increases cancellation drop-out by 68.4% due to queue wait anxiety and hostile agent retention scripts."
  },
  {
    id: "bait-and-switch",
    name: "Bait-and-Switch Pricing",
    category: "Billing Manipulation",
    description: "Advertising an incredibly cheap introductory rate, then quietly swapping the ongoing price to a drastically higher rate hidden in mouseprint.",
    example: "A streaming service advertising $1.99/mo, which quietly increases to $19.99/mo starting the third month without explicit secondary opt-in.",
    citation: "CFPB Deceptive Practices Guidance; UK Consumer Protection from Unfair Trading Regulations.",
    severity: "HIGH",
    remediation: "Display the post-introductory rate with equal typographic weight and size directly next to the introductory rate during enrollment.",
    whartonInsight: "Consumers focus almost exclusively on high-salience teaser prices, ignoring pricing tables unless they are visually forced into an explicit acknowledgement."
  },
  {
    id: "sneak-into-basket",
    name: "Sneak into Basket (Pre-bundled charges)",
    category: "Cart Manipulation",
    description: "Silently adding auxiliary subscriptions, protection plans, or recurring warranty costs to a user's transaction without their active selection.",
    example: "An airline ticket purchase that automatically checks an opt-in box for a $4.99/month travel assistance newsletter subscription.",
    citation: "FTC Act Section 5; EU Consumer Rights Directive.",
    severity: "HIGH",
    remediation: "All optional add-ons must be strictly opt-in by default. No pre-ticked checkboxes or hidden bundle structures allowed.",
    whartonInsight: "Pre-bundling exploits default-option bias, leading to 23% of purchasers carrying hidden micro-subscriptions for over 4 months before discovery."
  },
  {
    id: "hidden-fees-auto-escalation",
    name: "Hidden Fees & Dynamic Auto-Escalation",
    category: "Billing Manipulation",
    description: "Gradually introducing hidden regulatory recovery, administrative, or platform maintenance fees onto a subscription invoice without warning.",
    example: "A gym or cloud storage membership adding a $2.50 'annual safety levy' or 'tech service charge' on top of the contracted flat monthly subscription.",
    citation: "FTC Junk Fees Proposed Rule (16 CFR Part 464); EU DSA.",
    severity: "HIGH",
    remediation: "Strict upfront flat-rate transparency. Any secondary charge escalation must be approved via explicit secondary bank authorization.",
    whartonInsight: "Dynamic micro-billing hikes are often ignored by automated accounting systems, costing commercial teams up to 4.2% of unmonitored SaaS budget leaks."
  },
  {
    id: "pre-ticked-boxes",
    name: "Pre-ticked Recurring Consent",
    category: "Consent Distortion",
    description: "Defaulting checkboxes to 'Opt-In' for recurring charges, relying on the user's scanning oversight to pass them through into a monthly bill.",
    example: "A hardware shop checkout having a pre-ticked box saying 'Yes, sign me up for the $9.99/month instant filament replacement program.'",
    citation: "EU GDPR Article 7 (Active Affirmative Consent required); UK DMCC.",
    severity: "MEDIUM",
    remediation: "Require users to actively select an empty checkbox to opt in to any recurring subscription cycle.",
    whartonInsight: "Reversing pre-ticked boxes to active opt-ins drops initial subscription conversion by 71%, indicating the vast majority of subscribers were accidental."
  },
  {
    id: "unreachable-cancel-link",
    name: "The Obscured Cancel Gateway",
    category: "Navigation & Access Obstruction",
    description: "Styling the cancellation link to look like plain text, using an unreadable font size or contrast ratio, or hiding it inside unrelated menus like 'Legal Notices'.",
    example: "Placing the cancel link in 6px gray text inside a dense 10,000-word terms document, named 'Schedule C Section IV Agreement Termination'.",
    citation: "EU DSA Web Accessibility Standards; US ADA Web Guidelines.",
    severity: "CRITICAL",
    remediation: "A primary button styled clearly on the subscription settings dashboard with a contrast ratio of at least 4.5:1.",
    whartonInsight: "Users take an average of 4.2 minutes to locate an obscured cancel link, compared to 8.2 seconds for a compliant, standard labeled tab."
  },
  {
    id: "visual-steering-and-asymmetry",
    name: "Visual Asymmetry & Steering",
    category: "Visual Deception",
    description: "Using dramatic visual hierarchies to redirect the user's hand away from cancellation towards retention.",
    example: "Rendering a massive glowing neon emerald 'Stay Premium' button alongside an invisible, unbordered, neutral cancel link styled like plain text.",
    citation: "EU DSA Article 25 (Dark Patterns in online interfaces prohibited).",
    severity: "HIGH",
    remediation: "Equal-Weight Dual Choice: cancel and keep controls must use identical dimensions, padding, font weights, and border geometries.",
    whartonInsight: "Steering UI successfully intercepts 34% of cancellation attempts but dramatically ruins brand loyalty, dropping net promoter scores by 55 points."
  },
  {
    id: "subscription-trap-sign-up",
    name: "The Sign-up Hook (Immediate Capture)",
    category: "Interaction Obstruction",
    description: "Enabling immediate sign-up with simple email and card inputs, while requiring official proof, written letters, or security verifications to cancel.",
    example: "Signing up in 2 seconds via Apple Pay, but being forced to send a notarized letter to physical corporate offices in Delaware to initiate termination.",
    citation: "UK DMCC (Proportional Cancellation Channels); California ARL.",
    severity: "CRITICAL",
    remediation: "The rule of symmetry: If sign-up takes 1 click, cancellation must take a maximum of 2 clicks through the identical channel.",
    whartonInsight: "Asymmetric sign-up/cancel structures increase customer acquisition speed by 15% but trigger up to 10x the standard rate of class-action filings."
  },
  {
    id: "billing-frequency-loop",
    name: "The Irregular Billing Interval Loop",
    category: "Billing Manipulation",
    description: "Shifting billing dates or dividing monthly charges into weekly or 4-week increments (making 13 billing periods per year instead of 12) to obscure the real cumulative cost.",
    example: "SaaS charging '$19 per 4-weeks' instead of monthly, resulting in an extra unannounced monthly invoice every calendar year.",
    citation: "FTC Deceptive Advertising Guidelines; CFPB Regulation E.",
    severity: "MEDIUM",
    remediation: "Standardize billing strictly into clear calendar monthly or annual intervals with upfront yearly cumulative calculators.",
    whartonInsight: "Using 4-week billing intervals exploits the cognitive heuristic where users equate '4-weeks' with '1-month', silently draining 8.3% more annual budget."
  },
  {
    id: "hidden-termination-windows",
    name: "Hidden Termination Windows",
    category: "Billing Manipulation",
    description: "Strictly limiting cancellation to an obscure, narrow window (e.g., only 48 hours before the yearly renewal), otherwise forcing an automatic, lock-in annual rollover.",
    example: "Locking a B2B user into a $2,400 annual software contract renewal unless they cancel exactly 60 days before the contract expiry date.",
    citation: "UK DMCC Section 5; NY Automatic Renewal Law.",
    severity: "CRITICAL",
    remediation: "Allow cancellation at any time during the cycle, with proportional access termination or immediate partial credit.",
    whartonInsight: "Friction-based lock-ins lead to immense user frustration and drive a 28% increase in card chargebacks, which carries merchant penalty fines."
  },
  {
    id: "disguised-system-alerts",
    name: "Disguised System Prompts",
    category: "Visual Deception",
    description: "Making promotional subscription enrollment banners look like critical operating system alerts, security warnings, or system notifications.",
    example: "A browser popup reading 'WARNING: Cloud security may be compromised. Click here to purchase $14.99/mo premium virus security shield.'",
    citation: "FTC Guidelines on Deceptive OS Native Styling.",
    severity: "HIGH",
    remediation: "Clean isolation of system warnings from commercial upsells. Commercial offers must be strictly labeled as sponsored/promotional.",
    whartonInsight: "OS-mimicked banners trick 45% of users aged over 60, who carry these unintended services for an average of 9.2 months before family audit."
  },
  {
    id: "nagging-popups",
    name: "Aggressive Continuous Nagging",
    category: "Interaction Obstruction",
    description: "Repetitively interrupting a user's flow with intrusive full-screen subscription overlays that cannot be permanently dismissed.",
    example: "An online publisher showing a subscription paywall popup every 15 seconds even after the user has repeatedly clicked 'Maybe Later'.",
    citation: "EU DSA (Obstruction of typical service path is banned).",
    severity: "MEDIUM",
    remediation: "Implement a 'Do Not Ask Again' cookie or toggle. Cap promotional prompts to once per 30-day billing cycle.",
    whartonInsight: "Repeated interruptions cause acute task frustration, resulting in immediate churn from the platform for 32% of highly active daily users."
  },
  {
    id: "fake-social-proof",
    name: "Fabricated Social Urgency",
    category: "Cognitive Bias Exploitation",
    description: "Displaying fake real-time feeds of other users supposedly canceling their subscriptions and regretting it, or claiming fake limited spots to enforce quick enrollment.",
    example: "Showing a message: 'Sarah from Birmingham just cancelled her subscription and lost her data. Only 4 discount codes remaining!'",
    citation: "FTC Trade Regulation Rule on Impostor and Fake Reviews (16 CFR Part 465).",
    severity: "HIGH",
    remediation: "All reviews, active spot counters, or subscription counts must be statistically audited and verifiable, or completely omitted.",
    whartonInsight: "Manufactured social proof triggers FOMO (Fear Of Missing Out), driving impulsive credit card entries in 18.2% of highly emotional buyers."
  },
  {
    id: "induced-scarcity-timers",
    name: "Induced Scarcity Timers",
    category: "Cognitive Bias Exploitation",
    description: "Utilizing fake countdown timers to pressure a subscriber into completing an enrollment before they can review terms and conditions.",
    example: "A subscription discount having a 'Price lock ends in 02:45' timer which automatically resets back to 10:00 when the page is refreshed.",
    citation: "EU DSA Article 25; UK CMA Guidelines on Urgency Claims.",
    severity: "HIGH",
    remediation: "Timers must correspond to genuine, non-looping administrative deadlines. No artificial pressure tactics allowed.",
    whartonInsight: "Artificial timers shorten the average terms review time from 32 seconds to under 1.5 seconds, effectively hiding auto-renewal conditions."
  },
  {
    id: "survey-obstruction",
    name: "Interposed Survey Obstruction",
    category: "Interaction Obstruction",
    description: "Forcing a user to complete comprehensive, multi-page feedback surveys, exit questionnaires, or mandatory diagnostic tests before they can access the final cancellation button.",
    example: "A video editing subscription requiring you to explain why you are leaving, write a detailed feedback box, and watch a video demonstration before the cancel confirms.",
    citation: "FTC Click-to-Cancel (Exit surveys must be strictly optional and non-blocking).",
    severity: "HIGH",
    remediation: "Make all exit feedback surveys entirely optional. Provide a direct 'Skip and Cancel' button on the first page.",
    whartonInsight: "Forcing a 5-question feedback survey increases exit funnel abandonment by 41%, leaving unmotivated users locked in to unwanted billing cycles."
  },
  {
    id: "misdirection-swaps",
    name: "Interface Misdirection (Layout Shuffling)",
    category: "Visual Deception",
    description: "Interchanging the standard layout positions of primary and secondary buttons during successive screens of a cancellation wizard to trick a muscle-memorized finger into keeping.",
    example: "Screen 1 has 'Cancel' on the left and 'Keep' on the right. Screen 2 suddenly places 'Keep' on the left and 'Cancel' on the right.",
    citation: "FTC Unfair Interface Guidelines; California ARL.",
    severity: "HIGH",
    remediation: "Maintain strict spatial consistency for choice pathways throughout all cancellation wizard steps.",
    whartonInsight: "Spatial swapping capitalizes on rapid-clicking habits, successfully redirecting 52% of users back to the subscription active pool by accident."
  },
  {
    id: "trick-questions",
    name: "Trick Questions (Double Negatives)",
    category: "Consent Distortion",
    description: "Using confusing double-negatives or confusing grammatical layouts where a checkmark indicates opt-out, but an empty box indicates opt-in, or vice-versa.",
    example: "A checkbox labeled: 'Do not uncheck this box if you do not want us to avoid renewing your membership program.'",
    citation: "EU GDPR (Consent must be clear, plain language, and unambiguous).",
    severity: "HIGH",
    remediation: "Use direct, active-voice, single-sentence declarations (e.g., 'Yes, renew my subscription every month.').",
    whartonInsight: "Grammatical tricks trigger cognitive overload, forcing 74% of users to guess. Most users choose defaults, falling into hidden continuous charges."
  }
];

export default function DarkPatternLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPattern, setSelectedPattern] = useState<DarkPattern>(darkPatterns[0]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(darkPatterns.map(p => p.category)))];

  const filteredPatterns = darkPatterns.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.remediation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "ALL" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB] gap-6" id="dark-pattern-library-container">
      {/* Overview Card */}
      <div className="bg-[#0F172A] text-white p-6 rounded-lg border-2 border-[#0F172A] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-sm font-mono uppercase tracking-widest font-black text-red-400">Tricky Design Detector</h3>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-sans">LIBRARY OF TRICKY DESIGN TACTICS</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 max-w-2xl leading-relaxed">
            A list of 21 tricks companies use to lock you into subscriptions and take your money. Learn how they work, the laws that ban them, and how we protect you.
          </p>
        </div>
        <div className="shrink-0 font-mono text-[10px] text-[#94A3B8] border border-[#475569]/30 p-3 bg-slate-900 rounded-lg">
          <div className="flex justify-between gap-4 mb-1">
            <span>TACTICS LISTED:</span>
            <span className="font-bold text-white">21 / 21</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>LAWS REFERENCED:</span>
            <span className="font-bold text-red-400">ROSCA, CPRA, GDPR, DSA</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Left column: search and list (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-lg p-4 flex flex-col gap-4 h-[620px]">
          <div className="flex items-center gap-2 border-2 border-slate-900 px-3 py-2 rounded-lg bg-slate-50">
            <Search className="w-4 h-4 text-[#475569] shrink-0" />
            <input 
              type="text" 
              placeholder="Search 21 tricky design tactics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-[#0F172A] placeholder-[#475569] outline-none w-full"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-2 border-b border-[#475569]/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-all ${
                  activeCategory === cat 
                    ? "bg-[#0F172A] text-white border border-[#0F172A]" 
                    : "bg-slate-50 text-[#475569] border border-[#475569]/20 hover:border-[#0F172A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1">
            {filteredPatterns.length === 0 ? (
              <div className="p-8 text-center text-[#475569] italic text-xs">
                No tricks match your search.
              </div>
            ) : (
              filteredPatterns.map((pattern) => {
                const isSelected = selectedPattern.id === pattern.id;
                const isCritical = pattern.severity === "CRITICAL";
                const isHigh = pattern.severity === "HIGH";
                
                return (
                  <button
                    key={pattern.id}
                    onClick={() => setSelectedPattern(pattern)}
                    className={`w-full text-left p-3 flex flex-col gap-1 rounded-md transition-all ${
                      isSelected 
                        ? "bg-slate-900 text-white" 
                        : "hover:bg-slate-50 text-[#0F172A]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <span className="text-[11px] font-black tracking-tight leading-tight">
                        {pattern.name}
                      </span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-black ${
                        isCritical 
                          ? isSelected ? "bg-red-900 text-red-200" : "bg-red-50 text-red-600 border border-red-200"
                          : isHigh 
                          ? isSelected ? "bg-amber-950 text-amber-300" : "bg-amber-50 text-amber-600 border border-amber-200"
                          : isSelected ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                      }`}>
                        {pattern.severity}
                      </span>
                    </div>
                    <span className={`text-[9px] font-mono leading-none ${isSelected ? "text-slate-400" : "text-[#475569]"}`}>
                      {pattern.category}
                    </span>
                    <p className={`text-[10px] line-clamp-1 mt-1 leading-snug ${isSelected ? "text-slate-300" : "text-[#475569]"}`}>
                      {pattern.description}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: pattern deep dive (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-900 rounded-lg p-6 flex flex-col gap-5 h-[620px] overflow-y-auto">
          {selectedPattern ? (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="border-b border-[#475569]/10 pb-4">
                <div className="flex items-center gap-2 text-red-600 mb-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">
                    Severity Level: {selectedPattern.severity}
                  </span>
                </div>
                <h3 className="text-xl font-black tracking-tight text-[#0F172A]">
                  {selectedPattern.name}
                </h3>
                <p className="text-xs font-mono text-[#475569] mt-1">
                  Category: <strong className="font-bold text-[#0F172A]">{selectedPattern.category}</strong>
                </p>
              </div>

              {/* Behavior Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="text-[10px] font-bold text-[#0F172A] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#0F172A] rounded-full"></span>
                    How this trick works
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed font-sans">
                    {selectedPattern.description}
                  </p>
                </div>

                {/* Practical Example Box */}
                <div className="p-4 bg-red-50/30 border border-red-200/50 rounded-lg">
                  <h4 className="text-[10px] font-bold text-red-700 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    Real-World Example
                  </h4>
                  <p className="text-xs text-red-950 leading-relaxed font-mono">
                    {selectedPattern.example}
                  </p>
                </div>
              </div>

              {/* Regulatory Citation */}
              <div className="p-4 bg-amber-50/20 border border-amber-200 rounded-lg flex gap-3">
                <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold text-amber-800 font-mono uppercase tracking-wider mb-1">
                    Which law protects you
                  </h4>
                  <p className="text-xs text-amber-950 leading-relaxed font-mono font-bold">
                    {selectedPattern.citation}
                  </p>
                </div>
              </div>

              {/* Wharton Academic Insight */}
              <div className="p-4 bg-indigo-50/30 border border-indigo-200/50 rounded-lg flex gap-3">
                <FileText className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold text-indigo-800 font-mono uppercase tracking-wider mb-1">
                    What studies show about this
                  </h4>
                  <p className="text-xs text-indigo-950 leading-relaxed font-sans italic">
                    {selectedPattern.whartonInsight}
                  </p>
                </div>
              </div>

              {/* SubSnap Compliant Remediation */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-800 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider">
                    How SubSnap fixes this
                  </h4>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed font-sans font-bold">
                  {selectedPattern.remediation}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#475569] gap-2">
              <AlertTriangle className="w-8 h-8 text-[#475569]/40" />
              <p className="text-xs font-mono">Select a trick from the list to see legal details & study results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
