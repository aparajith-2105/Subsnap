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

// SubSnap Research & Advanced Compliance Components
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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Authentication Card States (Moved to top to prevent temporal dead zone)
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("subsnap_google_access_token");
    } catch (e) {
      return null;
    }
  });
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState<boolean>(false);

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
      async (user, token) => {
        const email = user.email || "";
        await mergeGuestData(email);
        setIsLoggedIn(true);
        setAuthEmail(email);
        setUserName(user.displayName || "Sathya Rammalu");
        setGoogleAccessToken(token);
        await fetchData();
      },
      () => {
        // Fall back gracefully if not active Google session
      }
    );
    return () => unsubscribe();
  }, [mergeGuestData]);

  // New features states
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Track authEmail with a ref to inject into fetch headers dynamically
  const authEmailRef = useRef(authEmail);
  useEffect(() => {
    authEmailRef.current = authEmail;
  }, [authEmail]);

  // Bulk Actions
  const handleBulkCancel = async () => {
    if (bulkSelectedIds.length === 0) return;
    try {
      const subsToCancel = subscriptions.filter(s => bulkSelectedIds.includes(s.id));
      await Promise.all(bulkSelectedIds.map(async (id) => {
        await apiFetch(`/api/subscriptions/${id}/cancel`, { method: "POST" });
      }));
      
      const [updatedSubs, updatedLogs, updatedNotifs] = await Promise.all([
        apiFetch("/api/subscriptions").then(r => r.json()),
        apiFetch("/api/logs").then(r => r.json()),
        apiFetch("/api/notifications").then(r => r.json())
      ]);
      setSubscriptions(updatedSubs);
      setLogs(updatedLogs);
      setNotifications(updatedNotifs);
      setBulkSelectedIds([]);

      // Fire webhooks
      subsToCancel.forEach(sub => {
        triggerN8nWebhook(sub);
      });

      if (emailPreferences) {
        triggerEmailSimulation(
          "Bulk Subscriptions Cancelled",
          `A bulk cancellation action was completed for ${bulkSelectedIds.length} subscriptions.`
        );
      }
    } catch (err) {
      console.error("Error bulk cancelling:", err);
    }
  };

  const handleBulkRevoke = async () => {
    if (bulkSelectedIds.length === 0) return;
    try {
      const subsToRevoke = subscriptions.filter(s => bulkSelectedIds.includes(s.id));
      await Promise.all(bulkSelectedIds.map(async (id) => {
        await apiFetch(`/api/subscriptions/${id}/revoke`, { method: "POST" });
      }));
      
      const [updatedSubs, updatedLogs, updatedNotifs] = await Promise.all([
        apiFetch("/api/subscriptions").then(r => r.json()),
        apiFetch("/api/logs").then(r => r.json()),
        apiFetch("/api/notifications").then(r => r.json())
      ]);
      setSubscriptions(updatedSubs);
      setLogs(updatedLogs);
      setNotifications(updatedNotifs);
      setBulkSelectedIds([]);

      // Fire webhooks
      subsToRevoke.forEach(sub => {
        triggerN8nWebhook(sub);
      });

      if (emailPreferences) {
        triggerEmailSimulation(
          "Bulk VRP Mandates Revoked",
          `Bulk VRP revocation was successfully applied to ${bulkSelectedIds.length} subscriptions.`
        );
      }
    } catch (err) {
      console.error("Error bulk revoking:", err);
    }
  };

  // Subscription Share Text Summary Builder
  const getShareText = () => {
    const activeSubs = subscriptions.filter(s => s.status === "active");
    const totalSpend = activeSubs.reduce((sum, s) => sum + s.amount, 0);
    let txt = `📊 SubSnap Subsc


       
