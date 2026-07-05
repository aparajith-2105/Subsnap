import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  AlertTriangle, 
  Zap, 
  Mail, 
  Clock, 
  PlusCircle, 
  BookOpen, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Share2 
} from "lucide-react";
import { Subscription, AuditLog, SystemNotification } from "./types";
import { SUPPORTED_CURRENCIES } from "./currencyUtils";
import { googleLogout, initAuth } from "./firebase";
import ConsentLog from "./components/ConsentLog";
import LeakageCostCalculator from "./components/LeakageCostCalculator";

export default function App() {
  const [currentCurrency, setCurrentCurrency] = useState<string>("USD");

  // Persistent LocalStorage State Initialization
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem("subsnap_subscriptions");
    return saved ? JSON.parse(saved) : [
      { id: "1", merchant_name: "Spotify Individual", amount: 119.00, currency: "INR", status: "active", frequency: "monthly", predicted_next_date: "2026-08-05", is_anomaly: false },
      { id: "2", merchant_name: "Adobe Creative Cloud", amount: 89.99, currency: "USD", status: "active", frequency: "monthly", predicted_next_date: "2026-08-07", is_anomaly: true, anomaly_reason: "Zero active usage in 60 days" }
    ];
  });

  const [logs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("subsnap_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("subsnap_logged_in") === "true";
  });

  // Authentication Card States
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [isSignUpState, setIsSignUpState] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Sync state data directly to persistent local storage memory layers
  useEffect(() => {
    localStorage.setItem("subsnap_subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem("subsnap_logged_in", isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const authEmailRef = useRef(authEmail);
  useEffect(() => {
    authEmailRef.current = authEmail;
  }, [authEmail]);

  const mergeGuestData = useCallback(async (targetEmail: string) => {
    try {
      await fetch("/api/auth/merge-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestEmail: "guest", targetEmail }),
      });
    } catch (err) {
      console.error("Failed to merge guest data:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      async (user) => {
        const email = user.email || "";
        await mergeGuestData(email);
        setIsLoggedIn(true);
        setAuthEmail(email);
      },
      () => {}
    );
    return () => unsubscribe();
  }, [mergeGuestData]);

  const triggerEmailSimulation = (title: string, msg: string) => {
    console.log(`Simulation Email Portal Triggered: [${title}] ${msg}`);
  };

  const handleSendEmail = async () => {
    try {
      alert("Simulation Mode Active: Dispatching high-salience warning alerts safely via secure webhook pipelines!");
      triggerEmailSimulation("Manual Notification Portal Active", "User manually forced verification warning dispatches.");
    } catch (error) {
      console.error("Email portal connection error trace:", error);
    }
  };

  // FIXED: Explicitly string-typed date conversion to resolve build compiler block
  const handleAddSubscriptionData = (formData: any) => {
    const newSubscription: Subscription = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(),
      merchant_name: formData.merchant_name || "Custom Digital Subscription",
      amount: parseFloat(formData.amount) || 0.00,
      currency: currentCurrency || "USD", 
      status: "active",
      frequency: formData.frequency || "monthly",
      predicted_next_date: formData.predicted_next_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_anomaly: false
    };

    setSubscriptions(prev => [newSubscription, ...prev]);
  };

  const getShareText = () => {
    const activeSubs = subscriptions.filter(s => s.status === "active");
    const totalSpend = activeSubs.reduce((sum, s) => sum + s.amount, 0);
    return `📊 SubSnap Subscription Ledger Overview: Tracking ${activeSubs.length} active metrics with a combined structural overhead of ${totalSpend.toFixed(2)} ${currentCurrency}. Guard your wallet!`;
  };

  const executeShareAction = () => {
    const shareText = getShareText();
    if (navigator.share) {
      navigator.share({ title: 'SubSnap Security Update', text: shareText }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Ledger summary metadata text copied directly to clipboard memory matrices!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased p-6 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Zap className="h-6 w-6 text-slate-900 dark:text-slate-50 fill-current" /> SubSnap
          </h1>
          <p className="text-xs text-slate-500">Automated Subscription Leakage Prevention Matrix</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={currentCurrency} 
            onChange={(e) => setCurrentCurrency(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 dark:bg-slate-900 dark:border-slate-800"
          >
            {SUPPORTED_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
          </select>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 border border-slate-200 rounded-lg dark:border-slate-800">
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isLoggedIn ? (
            <button onClick={() => { setIsLoggedIn(false); googleLogout(); }} className="flex items-center gap-1 text-xs font-semibold bg-slate-900 text-white p-2 rounded-lg dark:bg-slate-50 dark:text-slate-900">
              <LogOut className="h-4 w-4" /> Log Out
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Session Securely Paused</span>
          )}
        </div>
      </header>

      {!isLoggedIn ? (
        <div className="max-w-md mx-auto my-12 p-6 bg-white border-2 border-slate-900 rounded-xl shadow-lg dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-1.5 text-slate-900 dark:text-slate-50">
            <User className="h-5 w-5" /> Account Setup Portal
          </h2>
          <p className="text-xs text-slate-400 mb-6">Initialize your personal cryptographic security wallet parameters.</p>
          <div className="space-y-4">
            {isSignUpState && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Your Full Name</label>
                <input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Sathya Rammalu" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg dark:bg-slate-950 dark:border-slate-800" />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email ID</label>
              <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="user@domain.com" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg dark:bg-slate-950 dark:border-slate-800" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
              <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg dark:bg-slate-950 dark:border-slate-800" />
            </div>
            <button onClick={() => setIsLoggedIn(true)} className="w-full bg-slate-900 text-white font-bold p-3 rounded-lg text-xs mt-4 hover:bg-slate-800 transition-colors dark:bg-slate-50 dark:text-slate-900">
              {isSignUpState ? "Initialize Profile" : "Secure Log In"}
            </button>
            <div className="text-center mt-4">
              <button onClick={() => setIsSignUpState(!isSignUpState)} className="text-[11px] font-medium text-slate-500 underline hover:text-slate-900 dark:hover:text-slate-100">
                {isSignUpState ? "Already registered? Log in here" : "New to SubSnap? Create account profile"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 bg-white border-2 border-slate-900 rounded-xl flex items-start gap-3 shadow-md dark:bg-slate-900 dark:border-red-900">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />


       
