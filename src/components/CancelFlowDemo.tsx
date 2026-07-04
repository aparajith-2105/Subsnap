import React, { useState } from "react";
import { Sliders, ShieldCheck, HelpCircle, Heart, Trash2, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export default function CancelFlowDemo({ currencySymbol = "$" }: { currencySymbol?: string }) {
  const [darkPatternStep, setDarkPatternStep] = useState(1); // 1, 2, 3, 4 (completed)
  const [transparentCompleted, setTransparentCompleted] = useState(false);
  const [darkCanceled, setDarkCanceled] = useState(false);

  const resetDemo = () => {
    setDarkPatternStep(1);
    setTransparentCompleted(false);
    setDarkCanceled(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB] gap-6" id="cancel-flow-demo-container">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-lg border-2 border-[#0F172A] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-sm font-mono uppercase tracking-widest font-black text-red-400">Interactive Simulator</h3>
          </div>
          <h2 className="text-2xl font-black tracking-tight">CANCEL BUTTON SIMULATOR</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 max-w-2xl leading-relaxed">
            Try our side-by-side live simulator to see how tricky websites make you jump through hoops to cancel, compared to our fast, simple 1-click cancellation.
          </p>
        </div>
        <button 
          onClick={resetDemo}
          className="shrink-0 py-2 px-4 bg-white hover:bg-slate-50 text-[#0F172A] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all shadow border-2 border-[#0F172A]"
        >
          Reset Simulation
        </button>
      </div>

      {/* Research HUD stats overlay */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#0F172A] pb-2 border-b border-[#475569]/10">
          Cancellation Flow Speed & Transparency Results
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="flex flex-col gap-1.5 md:pr-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Ease of Use Rating
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-red-600 font-bold block">Tricky Website Flow:</span>
                <span className="text-xl font-mono font-black text-red-600">51.2 / 100</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-600 font-bold block">SubSnap Fair Flow:</span>
                <span className="text-xl font-mono font-black text-emerald-600">87.2 / 100</span>
              </div>
            </div>
            <p className="text-[9px] text-[#475569] leading-tight">
              A score under 68 means the website is intentionally frustrating to use.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 md:px-6 pt-4 md:pt-0">
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              User Trust Rating
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-red-600 font-bold block">Tricky Website Flow:</span>
                <span className="text-xl font-mono font-black text-red-600">1.45 / 5.00</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-600 font-bold block">SubSnap Fair Flow:</span>
                <span className="text-xl font-mono font-black text-emerald-600">4.85 / 5.00</span>
              </div>
            </div>
            <p className="text-[9px] text-[#475569] leading-tight">
              Trust scores given by actual users who tried to cancel their memberships.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 md:pl-6 pt-4 md:pt-0">
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Time Taken to Cancel
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-red-600 font-bold block">Tricky Website Flow:</span>
                <span className="text-xl font-mono font-black text-red-600">122.0 seconds</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-600 font-bold block">SubSnap Fair Flow:</span>
                <span className="text-xl font-mono font-black text-emerald-600">18.6 seconds</span>
              </div>
            </div>
            <p className="text-[9px] text-[#475569] leading-tight">
              Hard websites intentionally waste your time to make you give up on cancelling.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* Manipulative "Dark Pattern" Gate (Left) */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="border-b pb-3 border-slate-200">
            <span className="text-[9px] font-mono uppercase bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200 font-bold">
              TRICKY WEBSITE STEPS
            </span>
            <h4 className="text-base font-black tracking-tight text-[#0F172A] mt-2">
              Standard Corporate Cancellation Loop
            </h4>
          </div>

          {darkCanceled ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center gap-3">
              <CheckCircle className="w-12 h-12 text-red-500 animate-bounce" />
              <h5 className="text-lg font-black text-slate-900">Subscription Terminated</h5>
              <p className="text-xs text-[#475569] max-w-sm">
                You successfully canceled after getting past 3 annoying screens that tried to stop you.
              </p>
              <button 
                onClick={() => { setDarkCanceled(false); setDarkPatternStep(1); }}
                className="mt-2 text-xs font-mono font-bold text-[#0F172A] underline hover:no-underline"
              >
                Restart Tricky Website Flow
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between gap-6 min-h-[300px]">
              {darkPatternStep === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg text-amber-950 text-xs">
                    <strong className="font-bold">Guilt-Trip Warning Active:</strong> We detect you are trying to cancel premium access.
                  </div>
                  
                  <div className="text-center py-4 px-2">
                    <Heart className="w-10 h-10 text-red-500 mx-auto mb-2 animate-pulse" />
                    <h5 className="text-sm font-black text-slate-900">Are you absolutely sure you want to leave us?</h5>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      By leaving us, you lose your premium badge, and 12 curated features will instantly stop working for your account. You will lose your special discount forever.
                    </p>
                  </div>

                  {/* Visual steering buttons */}
                  <div className="flex flex-col gap-2 mt-2">
                    <button 
                      onClick={() => alert("You kept your subscription.")}
                      className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs rounded-lg transition-all shadow-md transform hover:scale-[1.01]"
                    >
                      KEEP PREMIUM & SAVE SAVINGS (Recommended)
                    </button>
                    <button 
                      onClick={() => setDarkPatternStep(2)}
                      className="w-full py-1.5 text-slate-400 hover:text-red-500 font-mono text-[9px] uppercase tracking-wider text-center"
                    >
                      No, I still want to cancel my membership
                    </button>
                  </div>
                </div>
              )}

              {darkPatternStep === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="bg-red-50 border border-red-300 p-3.5 rounded-lg text-red-950 text-xs">
                    <strong className="font-bold">Forced Survey:</strong> You must answer this feedback survey before we unlock the cancellation options.
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="block text-[10px] font-bold uppercase font-mono text-slate-700">
                      Why are you canceling your subscription? (Required)
                    </label>
                    <div className="flex flex-col gap-2 p-1">
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input type="radio" name="cancel_reason" defaultChecked className="accent-slate-900" />
                        <span>It's too expensive</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input type="radio" name="cancel_reason" className="accent-slate-900" />
                        <span>I don't use it enough</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input type="radio" name="cancel_reason" className="accent-slate-900" />
                        <span>I found a better alternative</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button 
                      onClick={() => alert("Discount applied! You kept subscription for 50% off.")}
                      className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs rounded-lg transition-all shadow-md"
                    >
                      WAIT! Get 50% off if you stay
                    </button>
                    <button 
                      onClick={() => setDarkPatternStep(3)}
                      className="w-full py-2 text-[#475569] hover:text-slate-900 font-mono text-[10px] uppercase text-center border rounded-lg border-slate-200"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {darkPatternStep === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="bg-[#0F172A] text-white p-4 rounded-lg flex flex-col gap-1">
                    <span className="text-[9px] font-mono uppercase text-red-400 font-bold">Last Chance Offer</span>
                    <h5 className="text-sm font-black">Pause subscription instead of cancelling</h5>
                    <p className="text-[11px] text-slate-400">
                      Pause billing for 3 months. Keep your preferences and return whenever you wish.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button 
                      onClick={() => alert("Subscription Paused successfully! No billing for 3 months.")}
                      className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs rounded-lg transition-all shadow-md"
                    >
                      PAUSE BILLING FOR 3 MONTHS
                    </button>
                    <button 
                      onClick={() => setDarkCanceled(true)}
                      className="w-full py-2 text-red-600 hover:text-red-700 font-mono text-[10px] uppercase text-center border-2 border-red-500 rounded-lg font-bold"
                    >
                      No, complete cancellation of membership
                    </button>
                  </div>
                </div>
              )}

              {/* Step indicator footer */}
              <div className="border-t pt-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>STEPS TO FIGHT THROUGH:</span>
                <span className="font-bold text-slate-900">{darkPatternStep} / 3</span>
              </div>
            </div>
          )}
        </div>

        {/* Transparent "SubSnap" Flow (Right) */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          <div className="border-b pb-3 border-slate-200">
            <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              SUBSNAP FAIR FLOW
            </span>
            <h4 className="text-base font-black tracking-tight text-[#0F172A] mt-2">
              Simple, Fair 1-Click Cancel
            </h4>
          </div>

          {transparentCompleted ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center gap-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
              <h5 className="text-lg font-black text-slate-900">Subscription Cancelled</h5>
              <p className="text-xs text-[#475569] max-w-sm">
                Cancelled instantly without any surveys, questions, or guilt trips.
              </p>
              <button 
                onClick={() => setTransparentCompleted(false)}
                className="mt-2 text-xs font-mono font-bold text-[#0F172A] underline hover:no-underline"
              >
                Restart Transparent Flow
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between gap-6 min-h-[300px]">
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-slate-700 text-xs leading-relaxed font-sans">
                  <strong className="font-bold text-[#0F172A]">Honest details:</strong> Your cancellation starts immediately. You can still use the service until your current billing period ends. You will never be charged again.
                </div>

                <div className="p-4 bg-slate-50 border rounded-lg font-mono text-[11px] text-slate-600 flex flex-col gap-1">
                  <div className="flex justify-between border-b pb-1.5 mb-1.5 border-slate-200">
                    <span className="font-bold text-slate-900">Cancellation processing:</span>
                    <span>30 June 2026</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 mb-1.5 border-slate-200">
                    <span className="font-bold text-slate-900">System Access expires:</span>
                    <span>15 July 2026</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Future financial obligation:</span>
                    <span>{currencySymbol}0.00</span>
                  </div>
                </div>

                {/* SubSnap Equal Weight Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button 
                    onClick={() => alert("Subscription remains active.")}
                    className="py-3 px-4 border-2 border-slate-900 hover:bg-slate-50 text-[#0F172A] font-bold text-xs rounded-lg transition-all uppercase tracking-wider text-center"
                  >
                    Keep subscription
                  </button>
                  <button 
                    onClick={() => setTransparentCompleted(true)}
                    className="py-3 px-4 bg-[#EF4444] hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-all uppercase tracking-wider text-center"
                  >
                    Cancel subscription
                  </button>
                </div>
              </div>

              <div className="border-t pt-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>STEPS REQUIRED:</span>
                <span className="font-bold text-emerald-600">1 / 1 (Instant)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
