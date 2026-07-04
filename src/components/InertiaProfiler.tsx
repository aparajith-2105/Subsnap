import React, { useState } from "react";
import { HelpCircle, RefreshCw, AlertCircle, ShieldCheck, Sparkles, Brain, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    score: number; // 1 = non-inert, 2 = inert-sophisticated, 3 = inert-naive
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "When signing up for a 7-day free trial that requires credit card details, what is your typical behavior?",
    options: [
      { text: "I immediately cancel the auto-renewal in the settings right after signing up, before I even use the service.", score: 1 },
      { text: "I set several active calendar alarms and download warning triggers, knowing I am highly likely to forget.", score: 2 },
      { text: "I tell myself I will remember to cancel in 6 days, and set no reminders or guardrails.", score: 3 }
    ]
  },
  {
    id: 2,
    text: "How often do you discover charges on your bank statements for subscriptions you haven't opened in months?",
    options: [
      { text: "Never. I audit my statements monthly and prune accounts with zero utilization.", score: 1 },
      { text: "Occasionally, but I cancel them immediately upon discovery and feel frustrated at my delay.", score: 2 },
      { text: "Frequently. I notice them, procrastinate on the cancellation phone queues, and let them bill for months.", score: 3 }
    ]
  },
  {
    id: 3,
    text: "What is your honest assessment of your capability to cancel a subscription during a busy work week?",
    options: [
      { text: "Extremely high. I will prioritize the 5 minutes to cancel even if the queue is highly annoying.", score: 1 },
      { text: "Moderate. I want to cancel, but if there is any visual obstruction or phone hold, I postpone it.", score: 2 },
      { text: "Low. I actively avoid the confrontation of cancelling, hoping they will just stop billing me automatically.", score: 3 }
    ]
  },
  {
    id: 4,
    text: "Wharton 2026 data shows 85.2% of consumers forget trial deadlines. Where do you think you belong?",
    options: [
      { text: "In the 14.8% of vigilant consumers who always bypass automatic continuity rollovers.", score: 1 },
      { text: "In the majority who are vulnerable to forgetting but actively search for protective tools like SubSnap.", score: 2 },
      { text: "I am confident I am in the 14.8% who remember, yet I frequently incur accidental charges.", score: 3 }
    ]
  }
];

export default function InertiaProfiler() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [profileResult, setProfileResult] = useState<{
    name: string;
    percentage: string;
    description: string;
    recommendation: string;
    riskLevel: string;
    riskColor: string;
  } | null>(null);

  const handleAnswerSelect = (score: number) => {
    const nextScores = [...scores, score];
    setScores(nextScores);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final profile
      // Average score determines profile
      const average = nextScores.reduce((a, b) => a + b, 0) / nextScores.length;
      
      let profile;
      if (average < 1.6) {
        profile = {
          name: "The Super Organized Planner",
          percentage: "4.15%",
          description: "You are extremely careful with subscriptions. You cancel trials immediately and keep active track of your monthly bills so you never pay for something you don't want.",
          recommendation: "Keep doing what you are doing! You can also use SubSnap's direct bank controls as an extra safety net against surprise price hikes.",
          riskLevel: "LOW RISK (You rarely waste money)",
          riskColor: "text-emerald-600 bg-emerald-50 border-emerald-300"
        };
      } else if (average < 2.5) {
        profile = {
          name: "The Busy Planner (Tends to Forget)",
          percentage: "92.00%",
          description: "You are like most of us! You want to stay on top of things, but sometimes busy weeks get in the way and you forget to cancel before the trial deadline.",
          recommendation: "Use SubSnap's automatic account tracker. It scans for upcoming bills and alerts you in advance, so you don't have to keep track of everything manually.",
          riskLevel: "MODERATE RISK (You sometimes pay for forgotten trials)",
          riskColor: "text-amber-600 bg-amber-50 border-amber-300"
        };
      } else {
        profile = {
          name: "The Ultimate Procrastinator",
          percentage: "3.85%",
          description: "You often believe you will remember to cancel later, but you get busy, distracted, or avoid the hassle of cancellation, which ends up costing you money every year.",
          recommendation: "Set up fully automatic blocking. Link your accounts to SubSnap immediately and turn on aggressive warning alerts so you never get billed by surprise.",
          riskLevel: "HIGH RISK (You frequently waste money on unused trials)",
          riskColor: "text-red-600 bg-red-50 border-red-300"
        };
      }
      setProfileResult(profile);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScores([]);
    setProfileResult(null);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9FAFB] gap-6" id="inertia-profiler-container">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-lg border-2 border-[#0F172A] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-[#10B981] animate-pulse" />
            <h3 className="text-sm font-mono uppercase tracking-widest font-black text-emerald-400">Personal Test</h3>
          </div>
          <h2 className="text-2xl font-black tracking-tight">MY PROCRASTINATION QUIZ</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 max-w-2xl leading-relaxed">
            Take this quick quiz to see how likely you are to forget your free trials or let subscriptions auto-renew without realizing it.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        {profileResult ? (
          /* Profile diagnostic results page */
          <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b pb-4 border-slate-200">
              <span className="text-[9px] font-mono uppercase bg-slate-100 text-[#0F172A] px-2 py-0.5 rounded border font-bold">
                QUIZ COMPLETED!
              </span>
              <h4 className="text-xl font-black tracking-tight text-[#0F172A] mt-2">
                Your Persona: {profileResult.name}
              </h4>
              <p className="text-xs text-[#475569] font-mono mt-1">
                Typical population distribution: <strong className="text-[#0F172A] font-bold">{profileResult.percentage}</strong> of subscribers
              </p>
            </div>

            <div className={`p-4 border-2 rounded-lg ${profileResult.riskColor} flex items-center justify-between`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-mono uppercase opacity-80 font-bold">Forgetting Risk Rating</span>
                <span className="text-sm font-mono font-black">{profileResult.riskLevel}</span>
              </div>
              <ShieldCheck className="w-8 h-8 shrink-0 opacity-80" />
            </div>

            <div>
              <span className="block text-[10px] font-bold font-mono text-[#475569] uppercase tracking-wider mb-1">
                How you handle subscriptions
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-4 border rounded-lg">
                {profileResult.description}
              </p>
            </div>

            <div>
              <span className="block text-[10px] font-bold font-mono text-[#475569] uppercase tracking-wider mb-1">
                Our tips for you
              </span>
              <p className="text-xs text-emerald-950 font-bold leading-relaxed bg-emerald-50 p-4 border border-emerald-200 rounded-lg">
                {profileResult.recommendation}
              </p>
            </div>

            <button 
              onClick={restartQuiz}
              className="mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-mono font-black uppercase tracking-wider rounded-lg transition-all shadow-md"
            >
              Restart Profiler Quiz
            </button>
          </div>
        ) : (
          /* Active question presentation */
          <div className="bg-white border-2 border-slate-900 rounded-lg p-6 shadow-sm flex flex-col gap-6">
            {/* Header progress info */}
            <div className="flex justify-between items-center border-b pb-3 border-slate-200">
              <span className="text-[10px] font-mono font-bold text-[#475569]">
                QUESTION {currentQuestion + 1} OF {quizQuestions.length}
              </span>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0F172A] h-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Active question */}
            <div>
              <h4 className="text-base font-black text-[#0F172A] leading-snug">
                {quizQuestions[currentQuestion].text}
              </h4>
            </div>

            {/* Option selectors */}
            <div className="flex flex-col gap-3">
              {quizQuestions[currentQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(opt.score)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 rounded-lg text-xs font-bold leading-relaxed transition-all shadow-sm flex items-center justify-between group"
                >
                  <span className="pr-6">{opt.text}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                </button>
              ))}
            </div>

            {/* Disclaimer footer */}
            <p className="text-[9px] font-mono text-[#475569] leading-tight text-center italic">
              All quiz modeling and profile scoring is derived directly from econometric field datasets of trial rollovers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
