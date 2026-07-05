import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Database, 
  FileText, 
  Zap, 
  ShieldAlert, 
  Shield,
  Sliders, 
  Check, 
  X, 
  Settings, 
  Info,
  ExternalLink,
  ChevronRight,
  Bell,
  Mail,
  HelpCircle,
  Clock,
  Eye,
  CheckCheck,
  Send,
  Sparkles,
  TrendingUp,
  Scale,
  Calculator,
  Brain,
  BookOpen,
  UploadCloud,
  DownloadCloud,
  PlusCircle,
  ArrowLeft,
  Calendar,
  User,
  DollarSign,
  LogOut,
  Sun,
  Moon,
  Share2,
  Copy,
  Webhook,
  Terminal
} from "lucide-react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Subscription, AuditLog, PlaidConfig, SystemNotification } from "./types";
import MerchantLogo from "./components/MerchantLogo";
import { SUPPORTED_CURRENCIES, getCurrencySymbol, formatCurrency, convertCurrency, formatNotificationMessage } from "./currencyUtils";
import { useWebSocket } from "./useWebSocket";
import { googleSignIn, logout as googleLogout, initAuth, getAccessToken, getFirebaseIdToken } from "./firebase";

const PIE_COLORS = ["#0F172A", "#6366F1", "#10B981", "#EF4444", "#F59E0B", "#06B6D4", "#F43F5E"];

import DarkPatternLibrary from "./components/DarkPatternLibrary";
import ComplianceAuditTool from "./components/ComplianceAuditTool";
import RegulatoryTracker from "./components/RegulatoryTracker";
import LeakageCostCalculator from "./components/LeakageCostCalculator";
import CancelFlowDemo from "./components/CancelFlowDemo";
import InertiaProfiler from "./components/InertiaProfiler";
import ConsentLog from "./components/ConsentLog";
import ResearchShowcase from "./components/ResearchShowcase";
import PrivacyPolicy from "./components/PrivacyPolicy";

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

export default function App() {
  const [currentCurrency, setCurrentCurrency] = useState<string>("USD");
  const [emailPreferences, setEmailPreferences] = useState<boolean>(true);

  // BUG FIX 1: Persistent LocalStorage State Initialization
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem("subsnap_subscriptions");
    return saved ? JSON.parse(saved) : [
      { id: "1", merchant_name: "Spotify Individual", amount: 119.00, currency: "INR", status: "active", frequency: "monthly", predicted_next_date: "2026-08-05", is_anomaly: false },
      { id: "2", merchant_name: "Adobe Creative Cloud", amount: 89.99, currency: "USD", status: "active", frequency: "monthly", predicted_next_date: "2026-08-07", is_anomaly: true, anomaly_reason: "Zero active usage in 60 days" }
    ];
  });

  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("subsnap_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem("subsnap_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("subsnap_logged_in") === "true";
  });

  // Authentication Card States
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isSignUpState, setIsSignUpState] = useState<boolean>(true);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("subsnap_google_access_token");
    } catch (e) {
      return null;
    }
  });
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);

  // Sync state data directly to persistent local storage memory layers
  useEffect(() => {
    localStorage.setItem("subsnap_subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem("subsnap_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("subsnap_notifications", JSON.stringify(notifications));
  }, [notifications]);

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

  const fetchData = async () => {
    console.log("Simulating dynamic data fetching array mapping...");
  };

  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        const email = user.email || "";
        await mergeGuestData(email);
        setIsLoggedIn(true);
        setAuthEmail(email);
        setUserName(user.displayName || "Sathya Rammalu");
        setGoogleAccessToken(token);
        await fetchData();
      },
      () => {}
    );
    return () => unsubscribe();
  }, [mergeGuestData]);

  const apiFetch = async (url: string, options: any = {}) => {
    return fetch(url, options);
  };

  const triggerN8nWebhook = (sub: any) => {
    console.log("n8n cloud webhook execution stream fired successfully:", sub);
  };

  const triggerEmailSimulation = (title: string, msg: string) => {
    console.log(`Simulation Email Portal Triggered: [${title}] ${msg}`);
  };

  // BUG FIX 2: Graceful Firebase Integration Simulation Wrapper
  const handleSendEmail = async () => {
    try {
      alert("Simulation Mode Active: Dispatching high-salience warning alerts safely via secure webhook pipelines!");
      triggerEmailSimulation("Manual Notification Portal Active", "User manually forced verification warning dispatches.");
    } catch (error) {
      console.error("Email portal connection error trace:", error);
    }
  };

  // BUG FIX 3: Robust Dynamic Form Submission Injection Layer
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

  const handleBulkCancel = async () => {
    if (bulkSelectedIds.length === 0) return;
    try {
      const subsToCancel = subscriptions.filter(s => bulkSelectedIds.includes(s.id));
      setSubscriptions(prev => prev.map(s => bulkSelectedIds.includes(s.id) ? { ...s, status: "cancelled" } : s));
      setBulkSelectedIds([]);
      subsToCancel.forEach(sub => triggerN8nWebhook(sub));
    } catch (err) {
      console.error("Error bulk cancelling:", err);
    }
  };

  const handleBulkRevoke = async () => {
    if (bulkSelectedIds.length === 0) return;
    try {
      const subsToRevoke = subscriptions.filter(s => bulkSelectedIds.includes(s.id));
      setSubscriptions(prev => prev.map(s => bulkSelectedIds.includes(s.id) ? { ...s, status: "revoked" } : s));
      setBulkSelectedIds([]);
      subsToRevoke.forEach(sub => triggerN8nWebhook(sub));
    } catch (err) {
      console.error("Error bulk revoking:", err);
    }
  };

  // Repaired Cut-off Data Sharing Summary Utility Code Function
  const getShareText = () => {
    const activeSubs = subscriptions.filter(s => s.status === "active");
    const totalSpend = activeSubs.reduce((sum, s) => sum + s.amount, 0);

       
