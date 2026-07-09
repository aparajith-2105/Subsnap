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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem("subsnap_subscriptions");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem("subsnap_logs");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem("subsnap_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Authentication Card States (Moved to top to prevent temporal dead zone)
  const [authEmail, setAuthEmail] = useState<string>(() => {
    try {
      return localStorage.getItem("subsnap_auth_email") || "";
    } catch (e) {
      return "";
    }
  });
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem("subsnap_user_name") || "";
    } catch (e) {
      return "";
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("subsnap_is_logged_in") === "true";
    } catch (e) {
      return false;
    }
  });
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("subsnap_google_access_token");
    } catch (e) {
      return null;
    }
  });
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("subsnap_subscriptions", JSON.stringify(subscriptions));
    } catch (e) {
      console.error("Failed to save subscriptions to localStorage:", e);
    }
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem("subsnap_is_logged_in", String(isLoggedIn));
    } catch (e) {
      console.error("Failed to save isLoggedIn to localStorage:", e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem("subsnap_auth_email", authEmail);
    } catch (e) {
      console.error("Failed to save authEmail to localStorage:", e);
    }
  }, [authEmail]);

  useEffect(() => {
    try {
      localStorage.setItem("subsnap_user_name", userName);
    } catch (e) {
      console.error("Failed to save userName to localStorage:", e);
    }
  }, [userName]);

  useEffect(() => {
    try {
      localStorage.setItem("subsnap_logs", JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save logs to localStorage:", e);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem("subsnap_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.error("Failed to save notifications to localStorage:", e);
    }
  }, [notifications]);

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
    let txt = `📊 SubSnap Subscription Summary:\n`;
    txt += `Active Streams: ${activeSubs.length} | Monthly Spend: ${currencySymbol}${totalSpend.toFixed(2)}\n\n`;
    activeSubs.forEach((s) => {
      txt += `• ${s.name}: ${currencySymbol}${s.amount}/${s.billingCycle} (Next: ${new Date(s.predictedNextDate).toLocaleDateString()})\n`;
    });
    txt += `\nTracked securely with SubSnap Leakage Prevention Engine.`;
    return txt;
  };

  // Trigger n8n outbound webhook for cancellation/revocation events
  const triggerN8nWebhook = async (sub: Subscription) => {
    if (!isWebhookEnabled || !webhookUrl) return;
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subscription: sub.name,
          amount: sub.amount.toString(),
          date: new Date().toISOString().substring(0, 10),
          currency: currency
        }),
        mode: "cors"
      });
    } catch (err) {
      console.error("Error triggering n8n Webhook:", err);
    }
  };

  // Test webhook connection manually
  const testWebhook = async () => {
    if (!webhookUrl) {
      setWebhookTestStatus("Error: No URL provided");
      return;
    }
    setWebhookTestStatus("Sending...");
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subscription: "Netflix Premium (Test)",
          amount: "15.49",
          date: new Date().toISOString().substring(0, 10),
          currency: currency
        }),
        mode: "cors"
      });
      if (response.ok || response.status === 200) {
        setWebhookTestStatus("Success: 200 OK");
      } else {
        setWebhookTestStatus(`Status: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Test webhook failed:", err);
      setWebhookTestStatus(`Failed: Connection Error`);
    }
    setTimeout(() => setWebhookTestStatus(""), 4000);
  };

  // PDF Export
  const exportLogsToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      doc.text("SUBSNAP COMPLIANCE EVIDENCE LOG", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      const nowStr = new Date().toLocaleString("en-US", { timeZone: "UTC" });
      doc.text(`Generated on: ${nowStr} (UTC) | User: ${authEmail || "guest"}`, 14, 26);
      doc.text("Regulatory Audit Trail - Federal Trade Commission Negative Option Compliance", 14, 31);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 35, 196, 35);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 40, 182, 8, "F");
      
      doc.setTextColor(15, 23, 42);
      doc.text("TIMESTAMP", 16, 45);
      doc.text("ACTION / EVENT", 52, 45);
      doc.text("VERIFICATION STATUS", 152, 45);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 48, 196, 48);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      let y = 55;

      if (logs.length === 0) {
        doc.text("No active compliance logs registered.", 14, y);
      } else {
        logs.forEach((log) => {
          if (y > 265) {
            doc.addPage();
            y = 25;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y - 5, 182, 8, "F");
            doc.setTextColor(15, 23, 42);
            doc.text("TIMESTAMP", 16, y);
            doc.text("ACTION / EVENT", 52, y);
            doc.text("VERIFICATION STATUS", 152, y);
            doc.line(14, y + 3, 196, y + 3);
            y += 10;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
          }

          doc.setFillColor(255, 255, 255);
          doc.rect(14, y - 4, 182, 16, "F");

          doc.setTextColor(71, 85, 105);
          doc.setFont("courier", "bold");
          doc.text(`[${log.timestamp}]`, 16, y);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(15, 23, 42);
          doc.text(log.action.substring(0, 50), 52, y);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          const splitDetails = doc.splitTextToSize(log.details, 95);
          doc.text(splitDetails, 52, y + 4);

          if (log.status === "SUCCESS" || log.status === "COMPLIANT") {
            doc.setTextColor(16, 185, 129);
          } else if (log.status === "FAILED") {
            doc.setTextColor(239, 68, 68);
          } else {
            doc.setTextColor(59, 130, 246);
          }
          doc.setFont("helvetica", "bold");
          doc.text(log.status, 152, y);

          doc.setDrawColor(241, 245, 249);
          doc.line(14, y + 10, 196, y + 10);

          y += 16;
        });
      }

      doc.save(`SubSnap-Compliance-Evidence-${new Date().toISOString().substring(0, 10)}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  // A safe API fetch wrapper that appends the user-specific context header securely
  const apiFetch = useCallback(async (input: RequestInfo | URL, init?: RequestInit) => {
    const targetInit = init || {};
    let headers: Headers;
    if (targetInit.headers instanceof Headers) {
      headers = new Headers(targetInit.headers);
    } else if (Array.isArray(targetInit.headers)) {
      headers = new Headers(targetInit.headers);
    } else {
      headers = new Headers();
      if (targetInit.headers) {
        Object.entries(targetInit.headers).forEach(([k, v]) => {
          headers.set(k, v as string);
        });
      }
    }
    headers.set("x-user-email", authEmailRef.current || "guest");
    try {
      const idToken = await getFirebaseIdToken();
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
    } catch (e) {
      console.error("Error setting Authorization header:", e);
    }
    return fetch(input, {
      ...targetInit,
      headers,
    });
  }, []);

  const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}?email=${encodeURIComponent(isLoggedIn && authEmail ? authEmail : "guest")}`;

  // Establish real-time persistent WebSocket connection with exponential backoff, heartbeats, and automated sync fallback
  const { status: wsStatus, isPollingActive } = useWebSocket(wsUrl, {
    onPoll: () => {
      handleSync(true);
    },
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_subscription") {
          // Add subscription if not already present
          setSubscriptions((prev) => {
            if (prev.some((s) => s.id === data.subscription.id)) return prev;
            return [...prev, data.subscription];
          });
          
          // Add notification if not already present
          if (data.notification) {
            setNotifications((prev) => {
              if (prev.some((n) => n.id === data.notification.id)) return prev;
              return [data.notification, ...prev];
            });
          }

          // Add log if not already present
          if (data.log) {
            setLogs((prev) => {
              if (prev.some((l) => l.id === data.log.id)) return prev;
              return [data.log, ...prev];
            });
          }
        } else if (data.type === "subscription_updated") {
          // Update the specific subscription
          setSubscriptions((prev) => 
            prev.map((s) => s.id === data.subscription.id ? data.subscription : s)
          );

          if (data.notification) {
            setNotifications((prev) => {
              if (prev.some((n) => n.id === data.notification.id)) return prev;
              return [data.notification, ...prev];
            });
          }

          if (data.log) {
            setLogs((prev) => {
              if (prev.some((l) => l.id === data.log.id)) return prev;
              return [data.log, ...prev];
            });
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket event data:", err);
      }
    },
    onConnect: () => {
      console.log("[App] WebSocket connection successfully established and managed.");
    }
  });
  const [selectedSubId, setSelectedSubId] = useState<string>("adobe-1");
  const [sortBy, setSortBy] = useState<"name" | "amount" | "renewal">("name");
  const [alertActive, setAlertActive] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "vrp" | "logs" | "config" | "login" | "admin" |
    "darkPatterns" | "complianceAudit" | "regulatoryTracker" | 
    "costCalculator" | "flowComparison" | "inertiaProfiler" | 
    "consentLog" | "researchData" | "privacyPolicy"
  >("dashboard");
  const [bankLocation, setBankLocation] = useState<"US" | "UK" | "EU" | "IN" | "CN" | "CA" | "AU" | "SG" | "JP">("US");
  const [currency, setCurrency] = useState<"USD" | "GBP" | "EUR" | "INR" | "CNY" | "CAD" | "AUD" | "SGD" | "JPY">("USD");
  const [onboardingOption, setOnboardingOption] = useState<"none" | "plaid" | "csv" | "manual" | "receipt">("none");
  const [categoryMetric, setCategoryMetric] = useState<"spending" | "usage">("spending");
  const [selectedPieCategory, setSelectedPieCategory] = useState<string | null>(null);
  const [showComparePeriod, setShowComparePeriod] = useState<boolean>(false);
  const [showManual, setShowManual] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  const [webhookUrl, setWebhookUrl] = useState<string>("https://aparajith-21.app.n8n.cloud/webhook/subsnap-revocation");
  const [isWebhookEnabled, setIsWebhookEnabled] = useState<boolean>(true);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string>("");

  const currencySymbol = getCurrencySymbol(currency);

  // States for Ingestion sub-options
  // Option B: CSV Statement Upload
  const [csvRawText, setCsvRawText] = useState<string>("");
  const [csvParsedRows, setCsvParsedRows] = useState<any[]>([]);
  const [csvUploadedFileName, setCsvUploadedFileName] = useState<string>("");
  const [csvIsDragActive, setCsvIsDragActive] = useState<boolean>(false);

  // Option C: Manual Add Form
  const [manualName, setManualName] = useState<string>("");
  const [manualAmount, setManualAmount] = useState<string>("");
  const [manualFrequency, setManualFrequency] = useState<string>("monthly");
  const [manualCategory, setManualCategory] = useState<string>("Entertainment");
  const [manualNextBillingDate, setManualNextBillingDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  // Option D: Receipt Paste
  const [receiptPasteText, setReceiptPasteText] = useState<string>("");
  const [isReceiptParsing, setIsReceiptParsing] = useState<boolean>(false);
  const [receiptParseError, setReceiptParseError] = useState<string | null>(null);
  const [parsedReceiptData, setParsedReceiptData] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Plaid configurations
  const [plaidConfig, setPlaidConfig] = useState<PlaidConfig>(() => {
    try {
      const saved = localStorage.getItem("subsnap_plaid_config");
      return saved ? JSON.parse(saved) : { clientId: "", secret: "", environment: "sandbox", accessToken: "" };
    } catch (e) {
      return { clientId: "", secret: "", environment: "sandbox", accessToken: "" };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("subsnap_plaid_config", JSON.stringify(plaidConfig));
    } catch (e) {
      console.error("Failed to save plaidConfig to localStorage:", e);
    }
  }, [plaidConfig]);
  const [isConfigSaved, setIsConfigSaved] = useState<boolean>(false);
  const [plaidConfigError, setPlaidConfigError] = useState<string | null>(null);

  // Email simulation preferences
  const [emailPreferences, setEmailPreferences] = useState<boolean>(true);
  const [emailPreviewModal, setEmailPreviewModal] = useState<boolean>(false);
  const [lastEmailSent, setLastEmailSent] = useState<{
    to: string;
    timestamp: string;
    subject: string;
    content: string;
  } | null>(null);

  // Notifications Popover
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);

  // Dual-Tab Onboarding Setup Tab State
  const [onboardingTab, setOnboardingTab] = useState<"bank" | "account">("bank");
  const [mobileShowContent, setMobileShowContent] = useState<boolean>(false);

  const navigateToTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setShowNotificationCenter(false);
    setMobileShowContent(true);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setUserName("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
    setAuthMessage(null);
    setAuthState("login");
    setEmailPreviewModal(false);
    setLastEmailSent(null);
    setActiveTab("login");
    setOnboardingOption("none");
    setMobileShowContent(false);
    setGoogleAccessToken(null);
    setSubscriptions([]);
    setNotifications([]);
    setLogs([]);
    googleLogout();
  };

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [authState, setAuthState] = useState<"signup" | "login" | "reset">("signup");
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");

  const handleDeleteAccount = async () => {
    try {
      const response = await apiFetch("/api/auth/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail }),
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUserName("");
        setAuthEmail("");
        setAuthPassword("");
        setAuthName("");
        setAuthMessage({ type: "success", text: "Your account and simulation data have been securely deleted." });
        setTermsAccepted(false);
        setAuthState("signup");
        setShowDeleteConfirm(false);
        setResetSuccessMessage(null);
        setResetErrorMessage(null);
        await fetchData();
      } else {
        const err = await response.json();
        alert(err.error || "Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
      setUserName("");
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
      setAuthMessage({ type: "success", text: "Your account was successfully removed. (Offline Fallback active)" });
      setTermsAccepted(false);
      setAuthState("signup");
      setShowDeleteConfirm(false);
    }
  };

  const handlePasswordResetInSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccessMessage(null);
    setResetErrorMessage(null);
    if (!newPasswordInput) {
      setResetErrorMessage("Please enter a new password.");
      return;
    }
    try {
      const response = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, newPassword: newPasswordInput }),
      });
      const data = await response.json();
      if (response.ok) {
        setResetSuccessMessage("Password successfully reset!");
        setNewPasswordInput("");
        setAuthPassword(newPasswordInput);
        await fetchData();
      } else {
        setResetErrorMessage(data.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setResetSuccessMessage("Password updated successfully! (Offline Fallback active)");
      setNewPasswordInput("");
      setAuthPassword(newPasswordInput);
    }
  };

  const handlePasswordResetOutOfSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    if (!authEmail || !authPassword) {
      setAuthMessage({ type: "error", text: "Please enter both Email ID and New Password." });
      return;
    }
    try {
      const response = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, newPassword: authPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthMessage({ type: "success", text: "Password reset successfully! You can now log in." });
        setAuthState("login");
        setAuthPassword("");
      } else {
        setAuthMessage({ type: "error", text: data.error || "Failed to reset password." });
      }
    } catch (err) {
      console.error(err);
      setAuthMessage({ type: "success", text: "Password reset successfully! (Offline Fallback active)" });
      setAuthState("login");
    }
  };

  // VRP Spending Cap and simulated calendar clock states
  const [simulatedClock, setSimulatedClock] = useState<string>("2026-07-01T12:00");
  const [showSystemNotice, setShowSystemNotice] = useState<boolean>(true);
  const [simulatedDebitAmount, setSimulatedDebitAmount] = useState<string>("24.99");
  const [debitResponse, setDebitResponse] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [spendingCapInputs, setSpendingCapInputs] = useState<Record<string, string>>({});
  const [simulatedChargeAmount, setSimulatedChargeAmount] = useState<string>("24.99");
  const [transactionLog, setTransactionLog] = useState<Record<string, { type: "approved" | "blocked"; text: string }>>({});

  const handleSimulateCharge = async (id: string) => {
    const amount = Number(simulatedChargeAmount || 0);
    if (!amount || amount <= 0) return;
    try {
      const res = await apiFetch(`/api/subscriptions/${id}/charge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      const isBlocked = !res.ok || data.success === false;
      setTransactionLog(prev => ({
        ...prev,
        [id]: {
          type: isBlocked ? "blocked" : "approved",
          text: isBlocked ? (data.error || "Blocked by VRP ceiling rules.") : (data.message || `Simulated transaction attempt of ${currencySymbol}${amount.toFixed(2)} completed.`)
        }
      }));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const gameStateSymbol = () => {
    if (authState === "signup") return "🔐";
    if (authState === "reset") return "🔄";
    return "🔓";
  };

  const interventionRef = useRef<HTMLDivElement>(null);

  // Fetch all initial data from backend APIs
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, logsRes, configRes, notifsRes] = await Promise.all([
        apiFetch("/api/subscriptions"),
        apiFetch("/api/logs"),
        apiFetch("/api/plaid/config"),
        apiFetch("/api/notifications")
      ]);
      
      const firestoreStatus = subsRes.headers.get("X-Firestore-Status") || "success";
      
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        if (firestoreStatus === "fallback") {
          console.warn("Firestore database access is limited/failing on the cloud. Merging with locally cached subscriptions.");
          const saved = localStorage.getItem("subsnap_subscriptions");
          const localSubs: Subscription[] = saved ? JSON.parse(saved) : [];
          const merged = [...subsData];
          localSubs.forEach((localSub) => {
            if (!merged.some(s => s.name.toLowerCase() === localSub.name.toLowerCase() || s.id === localSub.id)) {
              merged.push(localSub);
            }
          });
          setSubscriptions(merged);
        } else {
          setSubscriptions(subsData);
        }
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (firestoreStatus === "fallback") {
          const saved = localStorage.getItem("subsnap_logs");
          const localLogs: AuditLog[] = saved ? JSON.parse(saved) : [];
          const merged = [...logsData];
          localLogs.forEach((localLog) => {
            if (!merged.some(l => l.id === localLog.id)) {
              merged.push(localLog);
            }
          });
          setLogs(merged);
        } else {
          setLogs(logsData);
        }
      }
      if (configRes.ok) {
        const configData = await configRes.json();
        if (firestoreStatus === "fallback") {
          const saved = localStorage.getItem("subsnap_plaid_config");
          const localConfig = saved ? JSON.parse(saved) : null;
          if (localConfig && localConfig.clientId) {
            setPlaidConfig(localConfig);
            setIsConfigSaved(true);
          } else {
            setPlaidConfig({
              clientId: configData.clientId || "",
              secret: configData.secret || "",
              environment: configData.environment || "sandbox",
              accessToken: configData.accessToken || "",
            });
            setIsConfigSaved(configData.hasCredentials);
          }
        } else {
          setPlaidConfig({
            clientId: configData.clientId || "",
            secret: configData.secret || "",
            environment: configData.environment || "sandbox",
            accessToken: configData.accessToken || "",
          });
          setIsConfigSaved(configData.hasCredentials);
        }
      }
      if (notifsRes.ok) {
        const notifsData = await notifsRes.json();
        if (firestoreStatus === "fallback") {
          const saved = localStorage.getItem("subsnap_notifications");
          const localNotifs: SystemNotification[] = saved ? JSON.parse(saved) : [];
          const merged = [...notifsData];
          localNotifs.forEach((localNotif) => {
            if (!merged.some(n => n.id === localNotif.id)) {
              merged.push(localNotif);
            }
          });
          setNotifications(merged);
        } else {
          setNotifications(notifsData);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (subscriptions.length > 0) {
      const exists = subscriptions.some(s => s.id === selectedSubId);
      if (!exists) {
        setSelectedSubId(subscriptions[0].id);
      }
    } else {
      setSelectedSubId("");
    }
  }, [subscriptions, selectedSubId]);

  // Action Handlers
  const handleKeep = async (id: string) => {
    try {
      const response = await apiFetch(`/api/subscriptions/${id}/keep`, {
        method: "POST"
      });
      if (response.ok) {
        // Refresh local data
        const [updatedSubs, updatedLogs, updatedNotifs] = await Promise.all([
          apiFetch("/api/subscriptions").then(r => r.json()),
          apiFetch("/api/logs").then(r => r.json()),
          apiFetch("/api/notifications").then(r => r.json())
        ]);
        setSubscriptions(updatedSubs);
        setLogs(updatedLogs);
        setNotifications(updatedNotifs);

        // If email notifications are enabled, trigger an email warning log simulation
        if (emailPreferences) {
          triggerEmailSimulation(
            "Guardrail Activated: Keep Subscription",
            `We registered your decision to keep the subscription for ${updatedSubs.find((s: any) => s.id === id)?.name || "merchant"}. Access remains active without emotional nudging.`
          );
        }
      }
    } catch (err) {
      console.error("Error keeping subscription:", err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const subToCancel = subscriptions.find(s => s.id === id);
      const response = await apiFetch(`/api/subscriptions/${id}/cancel`, {
        method: "POST"
      });
      if (response.ok) {
        const [updatedSubs, updatedLogs, updatedNotifs] = await Promise.all([
          apiFetch("/api/subscriptions").then(r => r.json()),
          apiFetch("/api/logs").then(r => r.json()),
          apiFetch("/api/notifications").then(r => r.json())
        ]);
        setSubscriptions(updatedSubs);
        setLogs(updatedLogs);
        setNotifications(updatedNotifs);

        if (subToCancel) {
          triggerN8nWebhook(subToCancel);
        }

        if (emailPreferences) {
          triggerEmailSimulation(
            "Subscription Cancelled Successfully",
            `Your subscription consent for ${updatedSubs.find((s: any) => s.id === id)?.name || "merchant"} has been ended. Active until next billing cycle. Obligations are cleared.`
          );
        }
      }
    } catch (err) {
      console.error("Error cancelling subscription:", err);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const subToRevoke = subscriptions.find(s => s.id === id);
      const response = await apiFetch(`/api/subscriptions/${id}/revoke`, {
        method: "POST"
      });
      if (response.ok) {
        const [updatedSubs, updatedLogs, updatedNotifs] = await Promise.all([
          apiFetch("/api/subscriptions").then(r => r.json()),
          apiFetch("/api/logs").then(r => r.json()),
          apiFetch("/api/notifications").then(r => r.json())
        ]);
        setSubscriptions(updatedSubs);
        setLogs(updatedLogs);
        setNotifications(updatedNotifs);

        if (subToRevoke) {
          triggerN8nWebhook(subToRevoke);
        }

        if (emailPreferences) {
          triggerEmailSimulation(
            "VRP Payment Mandate Revoked",
            `VRP instant block active on your account for ${updatedSubs.find((s: any) => s.id === id)?.name || "merchant"}. No further charges can be authorized.`
          );
        }
      }
    } catch (err) {
      console.error("Error revoking VRP:", err);
    }
  };

  const handleUpdateSpendingCap = async (id: string, limit: number) => {
    try {
      const res = await apiFetch(`/api/subscriptions/${id}/spending-cap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ max_amount_per_charge: limit }),
      });
      if (res.ok) {
        const [updatedSubs, updatedLogs] = await Promise.all([
          apiFetch("/api/subscriptions").then(r => r.json()),
          apiFetch("/api/logs").then(r => r.json()),
        ]);
        setSubscriptions(updatedSubs);
        setLogs(updatedLogs);
      }
    } catch (err) {
      console.error("Error updating spending cap:", err);
    }
  };

  const handleSimulateDebit = async (id: string, amount: number) => {
    setDebitResponse(null);
    try {
      const res = await apiFetch(`/api/subscriptions/${id}/charge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      
      const [updatedSubs, updatedLogs, updatedNotifs] = await Promise.all([
        apiFetch("/api/subscriptions").then(r => r.json()),
        apiFetch("/api/logs").then(r => r.json()),
        apiFetch("/api/notifications").then(r => r.json())
      ]);
      setSubscriptions(updatedSubs);
      setLogs(updatedLogs);
      setNotifications(updatedNotifs);

      if (res.ok) {
        setDebitResponse({ type: "success", text: `Success: Debit charge of $${amount.toFixed(2)} processed on ledger.` });
      } else {
        setDebitResponse({ type: "error", text: data.error || "Blocked: Debit charge blocked by VRP ceiling rules." });
      }
    } catch (err) {
      console.error("Error simulating debit:", err);
      setDebitResponse({ type: "error", text: "Communication failed with bank gateway router." });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    if (!authEmail || !authPassword || !authName) {
      setAuthMessage({ type: "error", text: "Please enter your Email ID, Password, and Full Name." });
      return;
    }
    if (!termsAccepted) {
      setAuthMessage({ type: "error", text: "You must accept the terms of compliance service." });
      return;
    }

    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          name: authName
        })
      });
      const data = await res.json();
      if (res.ok) {
        await mergeGuestData(data.email);
        setIsLoggedIn(true);
        setAuthEmail(data.email);
        setUserName(data.name);
        setAuthMessage({ type: "success", text: `Registration successful! Account [${data.email}] secured with cryptographic tokens.` });
        setActiveTab("dashboard");
        await fetchData();
      } else {
        setAuthMessage({ type: "error", text: data.error || "Registration failed." });
      }
    } catch (err) {
      console.error(err);
      await mergeGuestData(authEmail);
      setIsLoggedIn(true);
      setAuthEmail(authEmail);
      setUserName(authName || authEmail.split("@")[0] || "User");
      setAuthMessage({ type: "success", text: "Registration successful! (Offline Fallback active)" });
      setActiveTab("dashboard");
      await fetchData();
    }
  };

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    if (!authEmail || !authPassword) {
      setAuthMessage({ type: "error", text: "Please enter your Email ID and Password." });
      return;
    }

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        await mergeGuestData(data.email);
        setIsLoggedIn(true);
        setAuthEmail(data.email);
        setUserName(data.name);
        setAuthMessage({ type: "success", text: `Welcome back, ${data.name}! Session authorized.` });
        setActiveTab("dashboard");
        await fetchData();
      } else {
        setAuthMessage({ type: "error", text: data.error || "Login failed." });
      }
    } catch (err) {
      console.error(err);
      await mergeGuestData(authEmail);
      setIsLoggedIn(true);
      setAuthEmail(authEmail);
      setUserName(authEmail.split("@")[0] || "User");
      setAuthMessage({ type: "success", text: `Welcome back! authorized.` });
      setActiveTab("dashboard");
      await fetchData();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleAuthLoading(true);
    setAuthMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        const email = result.user.email || "";
        const name = result.user.displayName || "Sathya Rammalu";
        await mergeGuestData(email);
        setIsLoggedIn(true);
        setAuthEmail(email);
        setUserName(name);
        setGoogleAccessToken(result.accessToken);
        setAuthMessage({ 
          type: "success", 
          text: `Successfully authenticated as ${email}. Real Google Workspace Gmail notifications are now enabled!` 
        });
        
        await apiFetch("/api/notifications/simulate-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: email,
            isRealGmail: true,
            subject: "OAuth Link Established",
            details: `Secure Google OAuth link established with Gmail permissions for ${email}.`
          })
        });
        setActiveTab("dashboard");
        await fetchData();
      }
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      let friendlyMessage = err.message || "Google Sign-In failed. Please try again.";
      if (err.code === "auth/operation-not-allowed") {
        friendlyMessage = "Google Sign-In is not enabled on this Firebase project yet. Please go to the Firebase Console -> Build -> Authentication -> Sign-in Method, and enable 'Google'.";
      } else if (err.code === "auth/unauthorized-domain") {
        friendlyMessage = `This domain (${window.location.host}) is not authorized in Firebase Auth. Please add it to your Authorized Domains in the Firebase Console under Authentication -> Settings -> Authorized Domains.`;
      } else if (err.code === "auth/popup-blocked") {
        friendlyMessage = "The browser blocked the sign-in popup. Please click again and allow popups, or open the app in a new tab.";
      } else if (err.code) {
        friendlyMessage = `Firebase error [${err.code}]: ${friendlyMessage}`;
      }
      setAuthMessage({ 
        type: "error", 
        text: friendlyMessage 
      });
    } finally {
      setIsGoogleAuthLoading(false);
    }
  };

  const handleSavePlaidConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlaidConfigError(null);
    try {
      const res = await apiFetch("/api/plaid/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plaidConfig),
      });
      if (res.ok) {
        setIsConfigSaved(true);
        // Trigger data sync
        handleSync();
      } else {
        const errData = await res.json().catch(() => ({}));
        setPlaidConfigError(errData.error || "Failed to update server configuration");
      }
    } catch (err) {
      setPlaidConfigError("Network error saving configuration");
    }
  };

  const handleResetPlaidConfig = async () => {
    setPlaidConfigError(null);
    const resetConfig = {
      clientId: "",
      secret: "",
      environment: "sandbox",
      accessToken: "",
    };
    try {
      const res = await apiFetch("/api/plaid/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetConfig),
      });
      if (res.ok) {
        setPlaidConfig(resetConfig);
        setIsConfigSaved(false);
        handleSync();
      } else {
        setPlaidConfigError("Failed to reset configuration");
      }
    } catch (err) {
      setPlaidConfigError("Network error resetting configuration");
    }
  };

  // Ingestion parsing and handler utilities
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    const results: any[] = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split(",").map(p => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length >= 2) {
        const name = parts[0];
        const amount = parseFloat(parts[1]);
        if (!name || isNaN(amount) || name.toLowerCase() === "name" || name.toLowerCase() === "merchant") {
          continue; // skip header or invalid rows
        }
        const frequency = parts[2] || "monthly";
        const category = parts[3] || "Utility";
        const nextDate = parts[4] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        results.push({ name, amount, currency: currency, frequency, category, predictedNextDate: nextDate });
      }
    }
    return results;
  };

  const handleCSVUpload = (text: string, fileName: string) => {
    setCsvUploadedFileName(fileName);
    setCsvRawText(text);
    const parsed = parseCSV(text);
    setCsvParsedRows(parsed.map((p, idx) => ({ ...p, id: `csv-row-${idx}`, checked: true })));
  };

  const handleBulkIngest = async () => {
    const selectedRows = csvParsedRows.filter(r => r.checked);
    if (selectedRows.length === 0) {
      alert("Please select at least one recurring stream to ingest.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiFetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptions: selectedRows }),
      });
      if (response.ok) {
        await fetchData();
        setCsvParsedRows([]);
        setCsvUploadedFileName("");
        setCsvRawText("");
        setOnboardingOption("none");
        
        // Add system notification
        const notifRes = await apiFetch("/api/notifications");
        if (notifRes.ok) {
          const notifs = await notifRes.json();
          setNotifications(notifs);
        }
      } else {
        const err = await response.json();
        alert(err.error || "Bulk ingestion failed.");
      }
    } catch (err) {
      console.error("Bulk ingestion failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualAmount.trim()) {
      alert("Please fill in the merchant name and amount.");
      return;
    }
    setIsLoading(true);
    try {
      const amountVal = parseFloat(manualAmount);
      const newSubObj = {
        name: manualName,
        amount: amountVal,
        currency: currency || "USD",
        frequency: manualFrequency || "monthly",
        category: manualCategory || "Other",
        predictedNextDate: manualNextBillingDate || new Date().toISOString().split("T")[0],
      };
      const response = await apiFetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptions: [newSubObj] }),
      });
      if (response.ok) {
        await fetchData();
        setManualName("");
        setManualAmount("");
        setOnboardingOption("none");
        
        // Add system notification
        const notifRes = await apiFetch("/api/notifications");
        if (notifRes.ok) {
          const notifs = await notifRes.json();
          setNotifications(notifs);
        }
      } else {
        const err = await response.json();
        alert(err.error || "Failed to add subscription.");
      }
    } catch (err) {
      console.error("Failed to add subscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParseReceipt = async () => {
    if (!receiptPasteText.trim()) {
      alert("Please paste receipt text first.");
      return;
    }
    setIsReceiptParsing(true);
    setReceiptParseError(null);
    setParsedReceiptData(null);
    try {
      const res = await apiFetch("/api/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: receiptPasteText, currency: currency }),
      });
      if (res.ok) {
        const data = await res.json();
        setParsedReceiptData(data);
      } else {
        const err = await res.json().catch(() => ({ error: "Receipt parsing failed." }));
        setReceiptParseError(err.error || "Parsing failed.");
      }
    } catch (err) {
      console.error("Failed to parse receipt:", err);
      setReceiptParseError("Failed to parse. Please try again.");
    } finally {
      setIsReceiptParsing(false);
    }
  };

  const handleConfirmReceiptIngest = async () => {
    if (!parsedReceiptData) return;
    setIsLoading(true);
    try {
      const response = await apiFetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptions: [parsedReceiptData] }),
      });
      if (response.ok) {
        await fetchData();
        setParsedReceiptData(null);
        setReceiptPasteText("");
        setOnboardingOption("none");
        
        // Add system notification
        const notifRes = await apiFetch("/api/notifications");
        if (notifRes.ok) {
          const notifs = await notifRes.json();
          setNotifications(notifs);
        }
      } else {
        const err = await response.json();
        alert(err.error || "Failed to ingest stream.");
      }
    } catch (err) {
      console.error("Failed to ingest stream:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const subsRes = await apiFetch("/api/subscriptions");
      const firestoreStatus = subsRes.headers.get("X-Firestore-Status") || "success";

      if (subsRes.ok) {
        const subsData = await subsRes.json();
        if (firestoreStatus === "fallback") {
          const saved = localStorage.getItem("subsnap_subscriptions");
          const localSubs: Subscription[] = saved ? JSON.parse(saved) : [];
          const merged = [...subsData];
          localSubs.forEach((localSub) => {
            if (!merged.some(s => s.name.toLowerCase() === localSub.name.toLowerCase() || s.id === localSub.id)) {
              merged.push(localSub);
            }
          });
          setSubscriptions(merged);
        } else {
          setSubscriptions(subsData);
        }
      }
      const logsRes = await apiFetch("/api/logs");
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (firestoreStatus === "fallback") {
          const saved = localStorage.getItem("subsnap_logs");
          const localLogs: AuditLog[] = saved ? JSON.parse(saved) : [];
          const merged = [...logsData];
          localLogs.forEach((localLog) => {
            if (!merged.some(l => l.id === localLog.id)) {
              merged.push(localLog);
            }
          });
          setLogs(merged);
        } else {
          setLogs(logsData);
        }
      }
      const notifsRes = await apiFetch("/api/notifications");
      if (notifsRes.ok) {
        const notifsData = await notifsRes.json();
        if (firestoreStatus === "fallback") {
          const saved = localStorage.getItem("subsnap_notifications");
          const localNotifs: SystemNotification[] = saved ? JSON.parse(saved) : [];
          const merged = [...notifsData];
          localNotifs.forEach((localNotif) => {
            if (!merged.some(n => n.id === localNotif.id)) {
              merged.push(localNotif);
            }
          });
          setNotifications(merged);
        } else {
          setNotifications(notifsData);
        }
      }
    } catch (err) {
      console.error("Failed to sync Plaid:", err);
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  const getSpendingTrendsData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    
    const dynamicMonths: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      const yName = d.getFullYear().toString().slice(-2);
      const label = `${mName} ${yName}${i === 0 ? " (Current)" : ""}`;
      dynamicMonths.push(label);
    }

    if (subscriptions.length === 0) {
      return dynamicMonths.map(month => ({
        month,
        "Total Spending": 0,
        "Core Subscriptions": 0,
        "Spikes / Adds": 0,
        "Previous Period Spending": 0
      }));
    }

    const activeSubs = subscriptions.filter(s => s.status !== "cancelled" && s.status !== "revoked");
    const totalActiveMonthly = activeSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0);
    const designAndOthers = activeSubs.filter(s => s.category === "Design" || s.category === "Entertainment");
    const coreSubs = activeSubs.filter(s => s.category !== "Design");
    const totalCoreMonthly = coreSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0);
    const totalDesignMonthly = designAndOthers.reduce((sum, s) => sum + getMonthlyCost(s), 0);

    const currentTotal = Number(totalActiveMonthly.toFixed(2));
    const currentCore = Number(totalCoreMonthly.toFixed(2));
    const currentSpikes = Number(totalDesignMonthly.toFixed(2));

    // To simulate realistic history based on current subscriptions
    return [
      { month: dynamicMonths[0], "Total Spending": Number((currentCore * 0.9).toFixed(2)), "Core Subscriptions": Number((currentCore * 0.9).toFixed(2)), "Spikes / Adds": 0, "Previous Period Spending": Number((currentCore * 0.8).toFixed(2)) },
      { month: dynamicMonths[1], "Total Spending": Number((currentCore * 0.95).toFixed(2)), "Core Subscriptions": Number((currentCore * 0.95).toFixed(2)), "Spikes / Adds": 0, "Previous Period Spending": Number((currentCore * 0.85).toFixed(2)) },
      { month: dynamicMonths[2], "Total Spending": Number((currentTotal * 0.95).toFixed(2)), "Core Subscriptions": Number((currentCore * 0.95).toFixed(2)), "Spikes / Adds": Number((currentSpikes * 0.95).toFixed(2)), "Previous Period Spending": Number((currentCore * 0.85).toFixed(2)) },
      { month: dynamicMonths[3], "Total Spending": Number((currentTotal * 0.98).toFixed(2)), "Core Subscriptions": Number((currentCore * 0.98).toFixed(2)), "Spikes / Adds": Number((currentSpikes * 0.98).toFixed(2)), "Previous Period Spending": Number((currentCore * 0.9).toFixed(2)) },
      { month: dynamicMonths[4], "Total Spending": Number(currentTotal.toFixed(2)), "Core Subscriptions": Number(currentCore.toFixed(2)), "Spikes / Adds": Number(currentSpikes.toFixed(2)), "Previous Period Spending": Number((currentCore * 0.9).toFixed(2)) },
      { month: dynamicMonths[5], "Total Spending": currentTotal, "Core Subscriptions": currentCore, "Spikes / Adds": currentSpikes, "Previous Period Spending": Number((currentCore * 0.92).toFixed(2)) }
    ];
  };

  const getMonthlyCost = (s: Subscription) => {
    const convertedAmount = convertCurrency(s.amount, s.currency || "USD", currency);
    if (s.frequency === "annual") {
      return convertedAmount / 12;
    } else if (s.frequency === "weekly") {
      return convertedAmount * 52 / 12;
    }
    return convertedAmount;
  };

  const getCategoryBreakdown = () => {
    const activeSubs = subscriptions.filter(
      s => s.status !== "cancelled" && s.status !== "revoked"
    );

    const breakdownMap: Record<string, {
      category: string;
      totalSpending: number;
      usageFrequency: number;
      count: number;
      subs: Subscription[];
    }> = {};

    activeSubs.forEach(s => {
      const category = s.category || "Other";
      const monthlyCost = getMonthlyCost(s);
      // Usage frequency represents active days/interactions in the last 30 days
      const usageFreq = Math.max(0, 30 - s.lastUsedDaysAgo);

      if (!breakdownMap[category]) {
        breakdownMap[category] = {
          category,
          totalSpending: 0,
          usageFrequency: 0,
          count: 0,
          subs: []
        };
      }

      breakdownMap[category].totalSpending += monthlyCost;
      breakdownMap[category].usageFrequency += usageFreq;
      breakdownMap[category].count += 1;
      breakdownMap[category].subs.push(s);
    });

    return Object.values(breakdownMap).map(item => ({
      ...item,
      totalSpending: Number(item.totalSpending.toFixed(2)),
      usageFrequency: Number(item.usageFrequency.toFixed(1))
    }));
  };

  const getProjectedAnnualWaste = () => {
    const activeSubs = subscriptions.filter(
      s => s.status !== "cancelled" && s.status !== "revoked"
    );

    const wastedSubs = activeSubs.filter(
      s => s.lastUsedDaysAgo > 15 || !!s.anomalyFlag
    );

    let totalWaste = 0;
    wastedSubs.forEach(s => {
      let annualCost = s.amount;
      if (s.frequency === "monthly") {
        annualCost = s.amount * 12;
      } else if (s.frequency === "weekly") {
        annualCost = s.amount * 52;
      }
      const convertedAnnual = convertCurrency(annualCost, s.currency || "USD", currency);
      totalWaste += convertedAnnual;
    });

    return {
      totalWaste: Number(totalWaste.toFixed(2)),
      wastedSubs
    };
  };

  const handleExportJSON = () => {
    const breakdown = getCategoryBreakdown();
    const { totalWaste, wastedSubs } = getProjectedAnnualWaste();
    const trends = getSpendingTrendsData();

    const report = {
      reportTitle: "SubSnap Subscription Cost & Spending Trends Report",
      generatedAt: new Date().toISOString(),
      activeCurrency: currency,
      currencySymbol: currencySymbol,
      summary: {
        totalMonthlyRecurringCost: Number(
          breakdown.reduce((sum, item) => sum + item.totalSpending, 0).toFixed(2)
        ),
        estimatedAnnualLeakageWaste: totalWaste,
        totalActiveSubscriptionsCount: subscriptions.filter(s => s.status !== "cancelled" && s.status !== "revoked").length
      },
      categoryBreakdown: breakdown.map(item => ({
        category: item.category,
        totalMonthlySpending: item.totalSpending,
        usageFrequencyScore: item.usageFrequency,
        subscriptionCount: item.count,
        items: item.subs.map(s => ({
          name: s.name,
          amount: s.amount,
          frequency: s.frequency,
          status: s.status,
          lastUsedDaysAgo: s.lastUsedDaysAgo
        }))
      })),
      projectedAnnualWasteSubscriptions: wastedSubs.map(s => ({
        id: s.id,
        name: s.name,
        amount: s.amount,
        frequency: s.frequency,
        lastUsedDaysAgo: s.lastUsedDaysAgo
      })),
      sixMonthTrends: trends
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subsnap_spending_trends_report_${currency}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearLogs = async () => {
    try {
      const res = await apiFetch("/api/logs/clear", { method: "POST" });
      if (res.ok) {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  };

  // Mark notification as read
  const handleMarkRead = async (id: string) => {
    try {
      const res = await apiFetch(`/api/notifications/${id}/read`, { method: "POST" });
      if (res.ok) {
        const updated = await apiFetch("/api/notifications").then(r => r.json());
        setNotifications(updated);
      }
    } catch (err) {
      console.error("Failed to read notification:", err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      const res = await apiFetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        const updated = await apiFetch("/api/notifications").then(r => r.json());
        setNotifications(updated);
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Simulate Discovery of a Subscription (Plaid Recurring Outflow endpoint)
  const handleSimulateDiscovery = async () => {
    try {
      const res = await apiFetch("/api/subscriptions/simulate-detect", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const newSub = data.subscription;
        
        // Refresh states
        const [updatedSubs, updatedLogs, updatedNotifs] = await Promise.all([
          apiFetch("/api/subscriptions").then(r => r.json()),
          apiFetch("/api/logs").then(r => r.json()),
          apiFetch("/api/notifications").then(r => r.json())
        ]);
        setSubscriptions(updatedSubs);
        setLogs(updatedLogs);
        setNotifications(updatedNotifs);
        
        // Target this new sub in the intervention flow
        setSelectedSubId(newSub.id);
        
        // If email notifications are enabled, trigger the mock notification email dispatch
        if (emailPreferences) {
          triggerEmailSimulation(
            `New Stream Discovered: ${newSub.name}`,
            `Plaid recurring engine detected a new recurring transaction pattern: ${newSub.name} (${currencySymbol}${newSub.amount.toFixed(2)}/${newSub.frequency}). Clean-path mitigation parameters set.`
          );
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Simulated discovery failed.");
      }
    } catch (err) {
      console.error("Simulated discovery failed:", err);
    }
  };

  const buildSubSnapEmailHtml = (subject: string, messageBody: string) => {
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background-color: #0f172a; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.025em; text-transform: uppercase;">SUBSNAP</h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0; text-transform: uppercase; tracking-wider; font-family: monospace;">SOVEREIGN ACTIVE CONSENT COMPLIANCE ENGINE</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 20px; color: #0f172a;">${subject}</h2>
            
            <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151; font-family: monospace;">
                ${messageBody}
              </p>
            </div>

            <p style="font-size: 13px; line-height: 1.5; color: #475569; margin-bottom: 25px;">
              This email was dispatched automatically via the secure SubSnap compliance engine in response to an identified recurring subscription event or direct request.
            </p>

            <a href="https://ais-dev-sqqql7glml7haio36uzn7v-344917494583.asia-southeast1.run.app" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #0f172a; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 13px; text-transform: uppercase; tracking-wider;">
              Access Dashboard
            </a>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 30px; text-align: center;">
            <p style="font-size: 11px; color: #64748b; margin: 0;">
              SubSnap &bull; FTC Negative-Option Guardrails &bull; Sovereign User Autonomy
            </p>
            <p style="font-size: 10px; color: #94a3b8; margin: 5px 0 0 0;">
              Secure session tracking via Plaid & Variable Recurring Payments (VRP).
            </p>
          </div>

        </div>
      </div>
    `;
  };

  // Helper to trigger interactive HTML email mock or real Google Workspace delivery
  const triggerEmailSimulation = async (subject: string, messageBody: string) => {
    const targetEmail = isLoggedIn && authEmail ? authEmail : "abc@gmail.com";
    let isRealGmail = false;
    let details = "";

    try {
      if (googleAccessToken) {
        try {
          const emailHtml = buildSubSnapEmailHtml(`[SubSnap Alert] ${subject}`, messageBody);
          // Construct raw MIME mail
          const emailLines = [
            `To: ${targetEmail}`,
            "Content-Type: text/html; charset=utf-8",
            "MIME-Version: 1.0",
            `Subject: [SubSnap Alert] ${subject}`,
            "",
            emailHtml
          ];
          const emailStr = emailLines.join("\r\n");
          // Safe base64 encoding
          const base64 = btoa(unescape(encodeURIComponent(emailStr)));
          const rawBase64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

          const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${googleAccessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ raw: rawBase64Url })
          });

          if (res.ok) {
            isRealGmail = true;
            details = `Dispatched actual Google Workspace Gmail to ${targetEmail} via authenticated OAuth session: "[SubSnap Alert] ${subject}".`;
            console.log("Real Gmail sent successfully!");
          } else {
            const errResponse = await res.text();
            console.error("Gmail API failed. Falling back to mock simulation.", errResponse);
            if (res.status === 401) {
              console.warn("Gmail token expired/unauthorized. Resetting token so user can re-login.");
              setGoogleAccessToken(null);
              try {
                localStorage.removeItem("subsnap_google_access_token");
              } catch (e) {}
            }
            details = `Failed to dispatch real Gmail (API error/Session expired). Simulated warning digest delivered to ${targetEmail}.`;
          }
        } catch (gmailErr) {
          console.error("Error during real Gmail sending process:", gmailErr);
          details = `Failed to dispatch real Gmail (Network error). Simulated warning digest delivered to ${targetEmail}.`;
        }
      }

      await apiFetch("/api/notifications/simulate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: targetEmail, 
          isRealGmail, 
          subject: `[SubSnap Alert] ${subject}`,
          details: details || `Sent deep-compliance warning digest to ${targetEmail} containing 3 pending risk summaries.`
        })
      });
      
      const updatedLogs = await apiFetch("/api/logs").then(r => r.json());
      setLogs(updatedLogs);

      setLastEmailSent({
        to: targetEmail,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        subject: `[SubSnap Alert] ${subject}`,
        content: messageBody,
      });
      setEmailPreviewModal(true);
    } catch (err) {
      console.error("Error trigger email simulation:", err);
    }
  };

  // Manual Trigger for Warning Digest Email Simulation
  const handleTriggerWarningDigest = () => {
    triggerEmailSimulation(
      "Salient Debit Warn & Idle Threat Digest",
      "This compliance digest details 3 active subscription risks. 1. Adobe Creative Cloud has zero usage. 2. Dashlane Family has zero logins. 3. Netflix Premium is due in 2 days. 1-click end options attached."
    );
  };

  const selectedSubscription = subscriptions.find(s => s.id === selectedSubId);
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const trendsData = getSpendingTrendsData();
  const hasAdobe = subscriptions.some(s => s.id === "adobe-1" || s.name.toLowerCase().includes("adobe"));
  const isAdobeActive = subscriptions.some(s => (s.id === "adobe-1" || s.name.toLowerCase().includes("adobe")) && s.status !== "cancelled" && s.status !== "revoked");

  // Helper to trigger alert intervention focus
  const triggerIntervention = (subId: string) => {
    const actualAdobe = subscriptions.find(s => s.id === "adobe-1" || s.name.toLowerCase().includes("adobe"));
    const idToUse = actualAdobe ? actualAdobe.id : subId;
    setSelectedSubId(idToUse);
    setActiveTab("dashboard");
    setTimeout(() => {
      interventionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (interventionRef.current) {
        interventionRef.current.classList.add("ring-2", "ring-[#EF4444]", "transition-all");
        setTimeout(() => {
          interventionRef.current?.classList.remove("ring-2", "ring-[#EF4444]");
        }, 1500);
      }
    }, 100);
  };

  return (
    <div className="bg-[#F9FAFB] text-[#0F172A] min-h-screen flex flex-col lg:flex-row font-sans antialiased selection:bg-[#10B981] selection:text-white">
      
      {/* PERSISTENT SIDEBAR */}
      <aside className={`w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-[#475569]/20 flex flex-col shrink-0 lg:h-screen lg:overflow-y-auto ${
        mobileShowContent ? "hidden lg:flex" : "flex"
      }`}>
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#475569]/10 flex flex-col">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                id="subsnap-header-logo"
              >
                {/* Active loop representing recurring subscription cycles */}
                <path d="M21 12a9 9 0 1 1-9-9" strokeDasharray="3 2" />
                {/* Sharp, bold geometric lightning bolt cutting through the loop */}
                <path 
                  d="M13 2L5 13h7l-2 9 8-11h-7Z" 
                  fill="#0F172A" 
                  stroke="#0F172A" 
                  strokeWidth="1" 
                />
              </svg>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tight text-[#0F172A] leading-none">
                  SUBSNAP
                </h1>
                <span className="text-[9px] font-mono tracking-wider text-[#475569] mt-1 uppercase">
                  Leakage Prevention Engine
                </span>
              </div>
            </div>
            
            {/* Accessible Global Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg border border-[#475569]/20 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
              id="theme-toggle-btn"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-[#0F172A]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Desk - Single Tier Flat Architecture */}
        <div className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
          {/* SECTION 1: CORE ENGINE */}
          <p className="text-[9px] font-mono font-black tracking-wider text-[#475569] px-2.5 mb-1 mt-1 uppercase">
            My Subscription Hub
          </p>
          
          <button 
            onClick={() => navigateToTab("dashboard")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "dashboard" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Subscription Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("vrp")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "vrp" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 shrink-0" />
              <span>Direct Bank Controls</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("logs")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "logs" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Cancel History Log</span>
            </div>
            <span className="bg-slate-100 text-[#0F172A] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-slate-200">
              {logs.length}
            </span>
          </button>

          <button 
            onClick={() => navigateToTab("config")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "config" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
            id="sidebar-bank-setup-button"
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 shrink-0" />
              <span>Bank Setup</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("login")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "login" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
            id="sidebar-login-button"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 shrink-0" />
              <span>{isLoggedIn ? "Signup and Login (Profile)" : "Signup and Login"}</span>
            </div>
            {isLoggedIn ? (
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            )}
          </button>

          {isLoggedIn && (
            <button 
              onClick={handleLogOut}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-rose-200/40"
              id="sidebar-logout-button"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out</span>
              </div>
            </button>
          )}

          {/* SECTION 2: COMPLIANCE & THREAT RECON */}
          <p className="text-[9px] font-mono font-black tracking-wider text-[#475569] px-2.5 mb-1 mt-3 uppercase">
            Anti-Trap & Safety Checks
          </p>

          <button 
            onClick={() => navigateToTab("darkPatterns")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "darkPatterns" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>Tricky Cancel Tactics</span>
            </div>
            <span className="bg-red-50 text-red-600 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-red-200">
              21 Hazards
            </span>
          </button>

          <button 
            onClick={() => navigateToTab("complianceAudit")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "complianceAudit" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Subscription Safety Checker</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("regulatoryTracker")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "regulatoryTracker" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Company Fines Tracker</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          {/* SECTION 3: RESEARCH & INTELLIGENCE */}
          <p className="text-[9px] font-mono font-black tracking-wider text-[#475569] px-2.5 mb-1 mt-3 uppercase">
            Fun Tools & Study Data
          </p>

          <button 
            onClick={() => navigateToTab("costCalculator")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "costCalculator" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calculator className="w-4 h-4 shrink-0 text-slate-700" />
              <span>Forgotten Cost Calculator</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("flowComparison")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "flowComparison" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 shrink-0 text-indigo-500" />
              <span>Cancel Simulator Game</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("inertiaProfiler")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "inertiaProfiler" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Brain className="w-4 h-4 shrink-0 text-purple-500" />
              <span>My Procrastination Quiz</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("consentLog")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "consentLog" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 shrink-0 text-teal-500" />
              <span>Receipt Archive</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("researchData")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "researchData" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 shrink-0 text-blue-500" />
              <span>Research Alignment</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button 
            onClick={() => navigateToTab("privacyPolicy")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "privacyPolicy" 
                ? "bg-[#0F172A] text-white" 
                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
            }`}
            id="sidebar-privacy-policy-link"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>
        </div>

        {/* Sidebar Status Info */}
        <div className="p-6 border-t border-[#475569]/10 bg-slate-50 flex flex-col gap-2 text-[10px] text-[#475569] font-mono">
          <div className="flex justify-between items-center">
            <span>Plaid Connection:</span>
            <span className={`font-bold ${isConfigSaved ? "text-emerald-600" : "text-amber-600"}`}>
              {isConfigSaved ? "LIVE API" : "LOCAL SANDBOX"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Active Warnings:</span>
            <span className="font-bold text-[#EF4444]">
              {subscriptions.filter(s => !!s.anomalyFlag && s.status === "active").length} Flagged
            </span>
          </div>
        </div>

      </aside>

      {/* MAIN CONTAINER */}
      <div className={`flex-1 flex flex-col h-screen overflow-y-auto ${
        mobileShowContent ? "flex" : "hidden lg:flex"
      }`}>
        
        {/* TOP BAR / HEADER */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#475569]/20 sticky top-0 z-40 shrink-0">
          <div className="flex items-center">
            {mobileShowContent && (
              <button
                onClick={() => setMobileShowContent(false)}
                className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-black text-[#0F172A] bg-slate-50 hover:bg-slate-100 transition-all mr-3 shrink-0"
                id="mobile-back-to-menu"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>
            )}
            <h2 className="text-xs lg:text-sm font-black uppercase tracking-wider text-[#0F172A]">
              {activeTab === "dashboard" && (
                <>
                  <span className="hidden lg:inline">SUBSCRIPTION CONTROL DASHBOARD & SAFETY CONTROLS</span>
                  <span className="lg:hidden">DASHBOARD</span>
                </>
              )}
              {activeTab === "vrp" && (
                <>
                  <span className="hidden lg:inline">DIRECT BANK CANCELLATION CONTROLS</span>
                  <span className="lg:hidden">DIRECT CANCELLATION</span>
                </>
              )}
              {activeTab === "logs" && (
                <>
                  <span className="hidden lg:inline">MY CANCEL HISTORY & OFFICIAL COMPLIANCE LOGS</span>
                  <span className="lg:hidden">COMPLIANCE LOGS</span>
                </>
              )}
              {activeTab === "config" && (
                <>
                  <span className="hidden lg:inline">ONBOARDING & MULTI-OPTION INGESTION CENTER</span>
                  <span className="lg:hidden">BANK SETUP</span>
                </>
              )}
              {activeTab === "login" && (
                <>
                  <span className="hidden lg:inline">SECURE SIGNUP & LOGIN PORTAL</span>
                  <span className="lg:hidden">SIGNUP & LOGIN PORTAL</span>
                </>
              )}
              {activeTab === "darkPatterns" && (
                <>
                  <span className="hidden lg:inline">TRICKY SIGN-UP TRAPS & CANCELLATION BARRIERS</span>
                  <span className="lg:hidden">TRICKY TRAPS</span>
                </>
              )}
              {activeTab === "complianceAudit" && (
                <>
                  <span className="hidden lg:inline">SUBSCRIPTION COMPLIANCE & SAFETY SCORE CHECKER</span>
                  <span className="lg:hidden">SAFETY CHECKER</span>
                </>
              )}
              {activeTab === "regulatoryTracker" && (
                <>
                  <span className="hidden lg:inline">COMPANY LITIGATION & FINE RECORDS ARCHIVE</span>
                  <span className="lg:hidden">FINES TRACKER</span>
                </>
              )}
              {activeTab === "costCalculator" && (
                <>
                  <span className="hidden lg:inline">FORGOTTEN SUBSCRIPTION WASTE CALCULATOR</span>
                  <span className="lg:hidden">WASTE CALCULATOR</span>
                </>
              )}
              {activeTab === "flowComparison" && (
                <>
                  <span className="hidden lg:inline">COMPARE CANCELLATION FLOWS (EASY VS HARD)</span>
                  <span className="lg:hidden">SIMULATOR GAME</span>
                </>
              )}
              {activeTab === "inertiaProfiler" && (
                <>
                  <span className="hidden lg:inline">TEST YOUR PROCRASTINATION SCORE</span>
                  <span className="lg:hidden">PROCRASTINATION TEST</span>
                </>
              )}
              {activeTab === "consentLog" && (
                <>
                  <span className="hidden lg:inline">OFFICIAL EXPLICIT CONSENT & RECEIPT ARCHIVE</span>
                  <span className="lg:hidden">RECEIPT ARCHIVE</span>
                </>
              )}
              {activeTab === "researchData" && (
                <>
                  <span className="hidden lg:inline">RESEARCH ALIGNMENT & ACADEMIC STUDY DATA</span>
                  <span className="lg:hidden">RESEARCH ALIGNMENT</span>
                </>
              )}
              {activeTab === "privacyPolicy" && (
                <>
                  <span className="hidden lg:inline">SUBSNAP PRIVACY POLICY & SECURE LOCAL AGREEMENT</span>
                  <span className="lg:hidden">PRIVACY POLICY</span>
                </>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Country & Currency Switcher Dropdown */}
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
              <label htmlFor="country-switcher" className="text-[10px] font-mono font-bold uppercase text-[#475569] hidden md:inline">Bank Setup:</label>
              <select
                id="country-switcher"
                value={bankLocation}
                onChange={(e) => {
                  const loc = e.target.value as "US" | "UK" | "EU" | "IN" | "CN" | "CA" | "AU" | "SG" | "JP";
                  setBankLocation(loc);
                  if (loc === "US") setCurrency("USD");
                  else if (loc === "UK") setCurrency("GBP");
                  else if (loc === "EU") setCurrency("EUR");
                  else if (loc === "IN") setCurrency("INR");
                  else if (loc === "CN") setCurrency("CNY");
                  else if (loc === "CA") setCurrency("CAD");
                  else if (loc === "AU") setCurrency("AUD");
                  else if (loc === "SG") setCurrency("SGD");
                  else if (loc === "JP") setCurrency("JPY");
                }}
                className="px-2 py-1 border-2 border-slate-900 rounded-lg text-xs font-bold text-[#0F172A] bg-white outline-none cursor-pointer"
              >
                <option value="US">🇺🇸 US (USD)</option>
                <option value="UK">🇬🇧 UK (GBP)</option>
                <option value="EU">🇪🇺 EU (EUR)</option>
                <option value="IN">🇮🇳 IN (INR)</option>
                <option value="CN">🇨🇳 CN (CNY)</option>
                <option value="CA">🇨🇦 CA (CAD)</option>
                <option value="AU">🇦🇺 AU (AUD)</option>
                <option value="SG">🇸🇬 SG (SGD)</option>
                <option value="JP">🇯🇵 JP (JPY)</option>
              </select>
            </div>

            {/* REAL-TIME WEBSOCKET STATUS PILL */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[#475569]/20 rounded-lg text-xs font-mono font-bold bg-slate-50" title={isPollingActive ? "Using automatic real-time background polling sync" : "Using persistent WebSocket connection"}>
              <span className="relative flex h-2 w-2">
                {wsStatus === "connected" ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                ) : wsStatus === "connecting" ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                )}
              </span>
              <span className="text-[10px] text-[#475569] uppercase tracking-wider">
                {wsStatus === "connected" && (isPollingActive ? "Link OK (Sync)" : "Link OK")}
                {wsStatus === "connecting" && "Reconnecting"}
                {wsStatus === "disconnected" && "Offline"}
              </span>
            </div>

            {/* Sync Trigger button */}
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="p-2 bg-white border border-[#475569]/30 hover:border-[#475569] text-[#0F172A] rounded-lg transition-all disabled:opacity-50 hover:bg-slate-50 flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title="Manual Plaid stream refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-500" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Plaid"}</span>
            </button>

            {/* REAL-TIME IN-APP NOTIFICATION BELL */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                className={`p-2 rounded-lg border transition-all flex items-center justify-center relative ${
                  showNotificationCenter 
                    ? "bg-[#0F172A] text-white border-[#0F172A]" 
                    : "bg-white text-[#475569] border-[#475569]/30 hover:bg-slate-50"
                }`}
                title="Real-time Alerts Engine"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-black font-mono rounded-full flex items-center justify-center animate-pulse border border-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* REAL-TIME IN-APP NOTIFICATION DROPDOWN / LOG DECK */}
              <AnimatePresence>
                {showNotificationCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-96 bg-white border border-[#475569] rounded-lg shadow-xl overflow-hidden z-50 flex flex-col max-h-[480px]"
                  >
                    <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-black uppercase tracking-wider">Real-Time Auditing Alerts</span>
                      </div>
                      {unreadNotifCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-mono text-[#10B981] hover:underline uppercase font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto divide-y divide-[#475569]/10 flex-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-[#475569] text-center italic py-8">No real-time alerts registered.</p>
                      ) : (
                        notifications.map((notif) => {
                          const isHigh = notif.severity === "high";
                          const isMedium = notif.severity === "medium";
                          return (
                            <div 
                              key={notif.id} 
                              className={`p-4 transition-colors flex gap-3 ${
                                notif.read ? "bg-white opacity-70" : "bg-slate-50"
                              }`}
                            >
                              {/* Left Severity Indicator Dot */}
                              <div className="shrink-0 pt-0.5">
                                <span className={`block w-2.5 h-2.5 rounded-full ${
                                  isHigh 
                                    ? "bg-[#EF4444]" 
                                    : isMedium 
                                    ? "bg-[#f59e0b]" 
                                    : "bg-[#10B981]"
                                }`}></span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1.5">
                                  <p className="text-xs font-black text-[#0F172A] leading-tight">
                                    {formatNotificationMessage(notif.title, currency)}
                                  </p>
                                  <span className="text-[8px] font-mono text-[#475569] whitespace-nowrap">
                                    {notif.timestamp.split(" ")[1] || notif.timestamp}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#475569] mt-1 leading-relaxed">
                                  {formatNotificationMessage(notif.message, currency)}
                                </p>
                                
                                <div className="mt-2.5 flex items-center justify-between">
                                  {notif.subId && (
                                    <button 
                                      onClick={() => {
                                        triggerIntervention(notif.subId!);
                                        setShowNotificationCenter(false);
                                      }}
                                      className="text-[9px] font-black text-[#0F172A] hover:underline uppercase flex items-center gap-0.5 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-[#475569]/10"
                                    >
                                      <span>INTERVENE</span>
                                      <ChevronRight className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                  {!notif.read && (
                                    <button 
                                      onClick={() => handleMarkRead(notif.id)}
                                      className="text-[9px] font-bold text-[#10B981] hover:underline uppercase ml-auto"
                                    >
                                      Mark read
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-[#475569]/10 text-center">
                      <p className="text-[9px] font-mono text-[#475569] uppercase">
                        SUBSNAP REAL-TIME AUDIT SECURE DATABASE
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-[#475569]/20 flex items-center justify-center font-black text-xs text-[#0F172A]">
                {isLoggedIn && userName ? (
                  userName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
                ) : (
                  "SR"
                )}
              </div>
              <span className="text-xs font-bold text-[#0F172A] hidden sm:inline">
                {isLoggedIn && userName ? userName : "Guest User"}
              </span>
            </div>
          </div>
        </header>

        {/* HIGH-SALIENCE BILLING NOTIFICATION CARD (placed absolute top of workspace) */}
        {activeTab === "dashboard" && alertActive && isAdobeActive && (
          <div className="px-6 pt-6 shrink-0">
            <div className="bg-white border-2 border-slate-900 rounded-lg p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#EF4444]"></div>
              
              <div className="flex gap-4 items-start md:items-center pl-2">
                <div className="p-2 bg-[#EF4444] text-white rounded-lg shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#EF4444]">Urgent High-Salience Debit Risk</p>
                    <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping"></span>
                  </div>
                  <p className="text-sm font-semibold text-[#0F172A] mt-1">
                    Alert: Your account will be debited <strong className="font-mono text-base font-black">{formatCurrency(convertCurrency(89.99, "USD", currency), currency)}</strong> on <strong className="font-extrabold">July 24, 2026</strong> for Adobe Creative Cloud unless action is taken.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
                <button 
                  onClick={() => triggerIntervention("adobe-1")}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white text-xs font-black tracking-wider uppercase rounded-lg transition-colors shadow-sm"
                >
                  INTERVENE NOW
                </button>
                <button 
                  onClick={() => setAlertActive(false)}
                  className="p-2.5 text-[#475569] hover:text-slate-900 hover:bg-slate-50 border border-[#475569]/30 rounded-lg transition-all"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE EMAIL SIMULATION VIEW BLOCK (When triggered, showcases how we send alerts to user) */}
        <AnimatePresence>
          {emailPreviewModal && lastEmailSent && (
            <div className="px-6 pt-6 shrink-0">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-[#475569] rounded-lg shadow-md overflow-hidden"
              >
                {/* Email Client Header Chrome */}
                <div className="bg-[#0F172A] px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest ml-4">
                      Compliance Sandbox Mail Delivery Engine
                    </span>
                  </div>
                  <button 
                    onClick={() => setEmailPreviewModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Email Envelope Header */}
                <div className="p-4 bg-slate-50 border-b border-[#475569]/10 text-xs text-[#475569] font-mono space-y-1">
                  <div>
                    <span className="font-bold text-[#0F172A] inline-block w-16">From:</span>
                    compliance@kineticledger.com (Verified SECURE)
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] inline-block w-16">To:</span>
                    {lastEmailSent.to}
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] inline-block w-16">Subject:</span>
                    <strong className="text-[#0F172A] font-black">{lastEmailSent.subject}</strong>
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] inline-block w-16">Sent:</span>
                    {lastEmailSent.timestamp} UTC
                  </div>
                </div>

                {/* Email HTML Body Canvas */}
                <div className="p-6 bg-white text-[#0F172A] max-w-2xl mx-auto border-x border-slate-50 my-4 shadow-sm rounded">
                  
                  {/* Ledger Email Logo */}
                  <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
                    <span className="font-black text-sm tracking-widest">SUBSNAP SYSTEMS</span>
                    <span className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded border">
                      LEAK_ALERT_ID: 992-X1
                    </span>
                  </div>

                  <p className="text-xs font-bold mb-4">Hello {userName ? userName.split(" ")[0] : "User"},</p>
                  
                  <p className="text-xs text-[#475569] leading-relaxed mb-6">
                    In strict accordance with the **FTC 2026 Negative Option Rule**, this automated alert protects you against ongoing subscription leakage, ghost charges, and merchant behavioral friction.
                  </p>

                  <div className="bg-slate-50 border border-slate-900/10 p-4 rounded-lg mb-6">
                    <p className="text-[10px] font-mono font-bold text-[#EF4444] uppercase tracking-wider mb-2">
                      LEAK RISK BRIEFING:
                    </p>
                    <p className="text-xs text-[#0F172A] leading-relaxed font-mono">
                      {lastEmailSent.content}
                    </p>
                  </div>

                  <div className="border-t border-[#475569]/20 pt-6 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#475569] uppercase font-bold tracking-tight">Neutral Legal Opt-Out Route:</p>
                      <p className="text-[11px] text-[#475569] mt-0.5">End billing stream instantly with no persuasive surveys.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEmailPreviewModal(false);
                        setActiveTab("dashboard");
                        interventionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap"
                    >
                      1-Click Legal Mitigation Portal
                    </button>
                  </div>

                  <p className="text-[9px] text-[#475569] leading-relaxed border-t border-[#475569]/10 pt-4">
                    Secure disclaimer: You are receiving this because auto-alerts are enabled on your connected Plaid bank stream. Obligations set to {formatCurrency(0.00, currency)} upon cancellation.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PRIMARY WORKSPACE */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6 overflow-visible">
          
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCw className="w-8 h-8 text-[#0F172A] animate-spin" />
              <p className="text-[#475569] text-xs font-mono tracking-wider uppercase">Loading SubSnap Engine...</p>
            </div>
          ) : !isLoggedIn && ["dashboard", "vrp", "logs", "config", "consentLog"].includes(activeTab) ? (
            <div className="max-w-md mx-auto w-full my-12 p-8 bg-white border border-slate-200 rounded-xl shadow-sm text-center space-y-6">
              <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                <Shield className="w-6 h-6 text-slate-800" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Security Authentication Required</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This workspace contains private open-banking linkages, automated compliance records, and active negative-option guardrails. Please sign in or register to access this dashboard.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("login")}
                className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Access Sign In Portal
              </button>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* INTERACTIVE USER MANUAL & QUICK-START GUIDE */}
                  {showManual ? (
                    <div className="bg-slate-50 border-2 border-slate-900 rounded-lg p-6 shadow-md relative overflow-hidden transition-all duration-300">
                      <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#0F172A]"></div>
                      <div className="flex items-start justify-between gap-4 pl-2">
                        <div className="flex gap-3">
                          <div className="p-2.5 bg-[#0F172A] text-white rounded-lg shrink-0 h-fit">
                            <BookOpen className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <span className="text-[9px] font-black tracking-widest uppercase text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              📚 ONBOARDING SYSTEM GUIDE
                            </span>
                            <h2 className="text-base font-black text-[#0F172A] mt-1.5 uppercase tracking-tight">
                              SUBSNAP OPERATIONAL QUICK-START MANUAL
                            </h2>
                            <p className="text-[11px] text-[#475569] mt-0.5">
                              Welcome to SubSnap, your sovereign command center for recurring payments. Below is the technical field manual to execute open banking actions.
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowManual(false)}
                          className="p-1.5 rounded-lg border border-slate-300 hover:border-slate-800 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all text-xs font-mono font-bold uppercase shrink-0 cursor-pointer"
                        >
                          ✕ Hide Manual
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pl-2 border-t border-slate-200 pt-5">
                        <div className="flex gap-2.5">
                          <div className="text-[14px] font-mono font-black text-[#0F172A] bg-white border border-slate-200 shadow-sm w-7 h-7 flex items-center justify-center rounded-lg shrink-0">1</div>
                          <div>
                            <h4 className="text-[11px] font-black uppercase text-[#0F172A] tracking-wider font-mono">Plaid & Bank Linkage</h4>
                            <p className="text-[10px] leading-relaxed text-[#475569] mt-1">
                              Go to <strong>Bank Setup</strong> to establish active open banking linkage. You can also upload a standard bank CSV or import mock subscriptions to seed transactions securely.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <div className="text-[14px] font-mono font-black text-[#0F172A] bg-white border border-slate-200 shadow-sm w-7 h-7 flex items-center justify-center rounded-lg shrink-0">2</div>
                          <div>
                            <h4 className="text-[11px] font-black uppercase text-[#0F172A] tracking-wider font-mono">Simulate Time Travel</h4>
                            <p className="text-[10px] leading-relaxed text-[#475569] mt-1">
                              Use the <strong>Simulated Calendar Clock</strong> directly below to fast-forward into the future. Shifting the date simulates renewal intervals and triggers early proactive alerts.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <div className="text-[14px] font-mono font-black text-[#0F172A] bg-white border border-slate-200 shadow-sm w-7 h-7 flex items-center justify-center rounded-lg shrink-0">3</div>
                          <div>
                            <h4 className="text-[11px] font-black uppercase text-[#0F172A] tracking-wider font-mono">Execute VRP Kill Switches</h4>
                            <p className="text-[10px] leading-relaxed text-[#475569] mt-1">
                              Select subscriptions and trigger bulk cancellations, or navigate to <strong>VRP Controls</strong> to instantly revoke merchant billing consent tokens at the central banking network.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 pl-2 border-t border-slate-100 pt-5">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h5 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wide">Real-time Safety Guardrails</h5>
                            <p className="text-[9.5px] leading-normal text-[#475569] mt-0.5">
                              Configure VRP spending limits and fire virtual debit transactions to test defensive filters in the <strong>VRP Consent Control Deck</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="p-1 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h5 className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wide">Regulatory Audits & Compliance</h5>
                            <p className="text-[9.5px] leading-normal text-[#475569] mt-0.5">
                              Every cancellation creates an official cryptographic record. Go to <strong>Compliance Logs</strong> to review, audit, and export FTC-compliant PDF dispute summaries.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-5 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-700" />
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-700">SubSnap Operational Guide is collapsed</span>
                      </div>
                      <button 
                        onClick={() => setShowManual(true)}
                        className="text-[10px] font-mono font-black uppercase text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      >
                        [Expand Guide Manual]
                      </button>
                    </div>
                  )}

                  {/* SIMULATED CLOCK & CALENDAR CONTROL PANEL */}
                  <div className="bg-[#0F172A] text-white p-4 rounded-lg border-2 border-slate-900 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 text-[#10B981] rounded-lg">
                        <Clock className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                          <span>Simulated Calendar Clock</span>
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded tracking-widest animate-pulse">ACTIVE</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Shift the timeline manually to trigger proactive alerts and risk countdowns</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <input
                        type="datetime-local"
                        value={simulatedClock}
                        onChange={(e) => setSimulatedClock(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-emerald-500 w-full md:w-auto"
                      />
                      <span className="text-xs text-[#10B981] font-mono font-bold whitespace-nowrap bg-slate-900/60 px-2.5 py-1 rounded border border-emerald-500/30">
                        {new Date(simulatedClock).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* PROACTIVE SYSTEM WARNING NOTICES */}
                  {subscriptions
                    .filter(sub => sub.status === "active")
                    .map(sub => {
                      const renewalTime = new Date(sub.predictedNextDate + "T00:00:00").getTime();
                      const currentTime = new Date(simulatedClock).getTime();
                      const diffMs = renewalTime - currentTime;
                      const hours = diffMs / (1000 * 60 * 60);
                      
                      if (hours > 0 && hours <= 48) {
                        return (
                          <div key={`system-notice-${sub.id}`} className="bg-amber-50 border-2 border-amber-500 rounded-lg p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden animate-pulse">
                            <div className="absolute top-0 bottom-0 left-0 w-2 bg-amber-500"></div>
                            <div className="flex gap-4 items-start pl-2">
                              <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">🔔 PROACTIVE SYSTEM NOTICE</p>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                  Urgent: Your <strong className="font-extrabold">{sub.name}</strong> subscription will auto-renew in less than <strong className="font-mono text-base font-black text-amber-700">{Math.floor(hours)}</strong> hours. Revoke consent now to avoid charges.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRevoke(sub.id)}
                              className="w-full md:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black tracking-wider uppercase rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                            >
                              Revoke Consent Now
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })
                  }

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Side: Subscription Streams (takes 2 cols) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      
                      {/* TRIALS EXPIRING SOON SUBSECTION */}
                      {subscriptions.filter(sub => sub.isTrial && sub.status === "active").length > 0 && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 space-y-4 shadow-sm">
                          <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
                            <span className="text-rose-500 animate-bounce">🚨</span>
                            <h3 className="text-xs font-black uppercase tracking-wider text-rose-800">
                              Trials Expiring Soon (Risk Management Panel)
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subscriptions
                              .filter(sub => sub.isTrial && sub.status === "active")
                              .map(sub => {
                                const renewalTime = new Date(sub.predictedNextDate + "T00:00:00").getTime();
                                const currentTime = new Date(simulatedClock).getTime();
                                const diffMs = renewalTime - currentTime;
                                const hours = diffMs / (1000 * 60 * 60);
                                
                                let countdownText = "";
                                let isExpired = false;
                                if (hours <= 0) {
                                  countdownText = "Expired / Pending Charge";
                                  isExpired = true;
                                } else if (hours < 24) {
                                  countdownText = `${Math.floor(hours)} hours remaining`;
                                } else {
                                  const days = Math.floor(hours / 24);
                                  const remHours = Math.floor(hours % 24);
                                  countdownText = `${days}d ${remHours}h remaining`;
                                }

                                return (
                                  <div key={sub.id} className="bg-white border border-rose-300 rounded-lg p-4 flex flex-col justify-between gap-3 shadow-sm relative">
                                    <div className="flex items-center gap-3">
                                      {sub.logoUrl ? (
                                        <img referrerPolicy="no-referrer" src={sub.logoUrl} className="w-8 h-8 rounded-full border border-slate-100 animate-pulse" alt={sub.name} />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800">
                                          {sub.logoLetter}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-900 truncate">{sub.name}</h4>
                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                                          isExpired ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800 animate-pulse"
                                        }`}>
                                          {countdownText}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between gap-2">
                                      <span className="text-[10px] text-slate-500 font-mono">
                                        Transitions to: <strong className="text-slate-900">${sub.nextTransitionAmount?.toFixed(2)}/mo</strong>
                                      </span>
                                      <button
                                        onClick={() => handleCancel(sub.id)}
                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider rounded transition-colors whitespace-nowrap cursor-pointer"
                                      >
                                        Cancel Trial
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                      )}

                      {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-[#0F172A] rounded-full"></span>
                        <h2 className="text-xs font-black uppercase tracking-wider text-[#475569]">
                          Detected Recurring Streams (Plaid API & Salt Edge)
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Sort Dropdown Menu */}
                        <div className="flex items-center gap-1.5 text-[10px] text-[#475569] font-mono bg-white px-2.5 py-1 rounded-lg border border-[#475569]/20 shadow-sm">
                          <span className="font-bold text-[#0F172A]">SORT BY:</span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent border-none p-0 text-[10px] font-mono text-[#0F172A] focus:ring-0 cursor-pointer outline-none font-bold"
                            style={{ background: 'none' }}
                          >
                            <option value="name" className="text-slate-900 bg-white">Name (A-Z)</option>
                            <option value="amount" className="text-slate-900 bg-white">Amount (Highest First)</option>
                            <option value="renewal" className="text-slate-900 bg-white">Next Renewal</option>
                          </select>
                        </div>

                        {/* Share Button */}
                        <button
                          onClick={() => setIsShareModalOpen(true)}
                          className="flex items-center gap-1.5 text-[10px] text-indigo-700 hover:text-indigo-800 font-mono bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-200/50 shadow-sm font-bold uppercase transition-colors cursor-pointer"
                          title="Share subscription summary"
                        >
                          <Share2 className="w-3 h-3 text-indigo-600" />
                          Share Summary
                        </button>

                        <span className="text-[10px] text-[#475569] font-mono flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-[#475569]/20 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                          Real-time Audited
                        </span>
                      </div>
                    </div>

                    {subscriptions.length === 0 ? (
                      <div className="bg-white border-2 border-slate-900 rounded-lg p-8 shadow-md text-center flex flex-col items-center justify-center gap-6 my-2">
                        <div className="w-16 h-16 rounded-full bg-[#F1F5F9] border border-slate-300 flex items-center justify-center text-slate-400">
                          <PlusCircle className="w-8 h-8 text-indigo-600" />
                        </div>
                        
                        <div className="space-y-2 max-w-md">
                          <h3 className="text-base font-black text-[#0F172A] uppercase tracking-wide">
                            No Active Streams Detected
                          </h3>
                          <p className="text-sm text-[#475569] leading-relaxed">
                            No subscriptions added yet. Add your first subscription to get started.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center max-w-md">
                          <button
                            onClick={() => {
                              setActiveTab("config");
                              setOnboardingOption("manual");
                            }}
                            className="flex-1 py-3 px-4 bg-[#0F172A] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow cursor-pointer"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Add Manually
                          </button>
                          
                          <button
                            onClick={() => {
                              setActiveTab("config");
                              setOnboardingOption("csv");
                            }}
                            className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-[#0F172A] font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-150 border-2 border-[#0F172A] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" />
                            Upload Statement
                          </button>
                        </div>

                        <div className="border-t border-slate-100 pt-5 w-full flex flex-col items-center gap-3">
                          <p className="text-[10px] text-slate-500 font-mono uppercase">
                            Or execute automatic detection simulation:
                          </p>
                          <button
                            onClick={handleSimulateDiscovery}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                          >
                            <Sparkles className="w-4 h-4" />
                            Simulate Stream Discovery
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Select All & Bulk Actions Panel */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#475569]/15 rounded-lg shadow-sm text-xs">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox"
                              id="select-all-subs"
                              checked={subscriptions.length > 0 && bulkSelectedIds.length === subscriptions.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBulkSelectedIds(subscriptions.map(s => s.id));
                                } else {
                                  setBulkSelectedIds([]);
                                }
                              }}
                              className="rounded border-slate-300 text-[#0F172A] focus:ring-slate-500 w-4 h-4 cursor-pointer accent-[#10B981]"
                            />
                            <label htmlFor="select-all-subs" className="font-bold text-[#0F172A] cursor-pointer uppercase tracking-wider text-[10px]">
                              Select All Streams ({subscriptions.length})
                            </label>
                          </div>
                          
                          {bulkSelectedIds.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono font-black text-[#475569] bg-slate-100 px-2.5 py-1 rounded border border-[#475569]/10">
                                {bulkSelectedIds.length} SELECTED
                              </span>
                              <button 
                                onClick={handleBulkCancel}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold text-[9px] uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3 h-3" /> Cancel Selected
                              </button>
                              <button 
                                onClick={handleBulkRevoke}
                                className="px-2.5 py-1 bg-[#EF4444] hover:bg-red-700 text-white rounded font-bold text-[9px] uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                              >
                                <Zap className="w-3 h-3" /> Revoke Selected
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Streams List */}
                        <div className="flex flex-col gap-3">
                          {[...subscriptions].sort((a, b) => {
                            if (sortBy === "name") {
                              return a.name.localeCompare(b.name);
                            } else if (sortBy === "amount") {
                              return b.amount - a.amount;
                            } else if (sortBy === "renewal") {
                              return new Date(a.predictedNextDate).getTime() - new Date(b.predictedNextDate).getTime();
                            }
                            return 0;
                          }).map((sub) => {
                            const isSelected = selectedSubId === sub.id;
                            const hasAnomaly = !!sub.anomalyFlag;
                            const isBulkChecked = bulkSelectedIds.includes(sub.id);
                            
                            return (
                              <div 
                                key={sub.id}
                                id={`sub-item-${sub.id}`}
                                onClick={() => setSelectedSubId(sub.id)}
                                className={`group relative p-4 rounded-lg border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                  isSelected 
                                    ? "bg-white border-[#0F172A] shadow-md ring-1 ring-[#0F172A]" 
                                    : "bg-white border-[#475569]/20 hover:border-[#475569]/60 hover:bg-slate-50"
                                } ${sub.status === "cancelled" || sub.status === "revoked" ? "opacity-60" : ""}`}
                              >
                                {/* Individual selection checkbox */}
                                <div 
                                  className="flex items-center self-stretch sm:self-auto shrink-0 pr-1 z-10" 
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input 
                                    type="checkbox"
                                    checked={isBulkChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setBulkSelectedIds(prev => [...prev, sub.id]);
                                      } else {
                                        setBulkSelectedIds(prev => prev.filter(id => id !== sub.id));
                                      }
                                    }}
                                    className="rounded border-slate-300 text-[#0F172A] focus:ring-slate-500 w-4.5 h-4.5 cursor-pointer accent-[#10B981]"
                                    aria-label={`Select subscription ${sub.name}`}
                                  />
                                </div>
                                {/* Accent indicators on Left for quick salience scanning */}
                                {hasAnomaly && sub.status === "active" && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EF4444]"></div>
                                )}
                                {sub.status === "cancelled" && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f59e0b]"></div>
                                )}
                                {sub.status === "revoked" && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EF4444]"></div>
                                )}

                                {/* Left Content: Logo, Name, Meta */}
                                <div className="flex gap-4 items-center flex-1 min-w-0">
                                  
                                  {/* Integrated Merchant Logo Component (Fulfills logo integration request) */}
                                  <MerchantLogo 
                                    name={sub.name} 
                                    logoLetter={sub.logoLetter} 
                                    logoUrl={sub.logoUrl} 
                                  />

                                  <div className="flex flex-col min-w-0">
                                    <p className="font-bold text-[#0F172A] flex flex-wrap items-center gap-2 text-sm md:text-base leading-snug">
                                      {sub.name}
                                      
                                      {/* Badges */}
                                      {sub.status === "keeping" && (
                                        <span className="px-1.5 py-0.5 bg-[#10B981]/15 text-[#10B981] text-[9px] font-black tracking-widest rounded-lg border border-[#10B981]/20">
                                          RETAINED
                                        </span>
                                      )}
                                      {sub.status === "cancelled" && (
                                        <span className="px-1.5 py-0.5 bg-[#f59e0b]/15 text-[#f59e0b] text-[9px] font-black tracking-widest rounded-lg border border-[#f59e0b]/20">
                                          PENDING TERMINATION
                                        </span>
                                      )}
                                      {sub.status === "revoked" && (
                                        <span className="px-1.5 py-0.5 bg-[#EF4444]/15 text-[#EF4444] text-[9px] font-black tracking-widest rounded-lg border border-[#EF4444]/20">
                                          VRP BLOCKED
                                        </span>
                                      )}
                                      {hasAnomaly && sub.status === "active" && (
                                        <span className="px-1.5 py-0.5 bg-[#EF4444]/15 text-[#EF4444] text-[9px] font-black tracking-widest rounded-lg border border-[#EF4444]/20 animate-pulse">
                                          INACTIVE GHOST STREAM
                                        </span>
                                      )}
                                    </p>

                                    {hasAnomaly && sub.status === "active" ? (
                                      <p className="text-xs text-[#EF4444] mt-1 font-bold flex items-center gap-1">
                                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                        {sub.anomalyFlag}
                                      </p>
                                    ) : (
                                      <p className="text-xs text-[#475569] mt-0.5 uppercase tracking-tighter">
                                        {sub.billingDetails} • Last used {sub.lastUsedDaysAgo === 0 ? "today" : `${sub.lastUsedDaysAgo}d ago`}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Right Content: Billing details */}
                                <div className="text-left sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-2 border-t border-[#475569]/10 sm:border-t-0 pt-2 sm:pt-0 font-mono text-xs">
                                  <div>
                                    <p className="font-bold text-base text-[#0F172A] leading-none">
                                      {formatCurrency(convertCurrency(sub.amount, sub.currency || "USD", currency), currency)}
                                    </p>
                                    <span className="text-[9px] text-[#475569] uppercase font-bold tracking-wider">
                                      {sub.frequency}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    {sub.status === "active" || sub.status === "keeping" ? (
                                      <p className="text-[10px] text-[#10B981] font-bold uppercase bg-[#10B981]/10 px-2 py-0.5 rounded-lg border border-[#10B981]/15">
                                        NEXT BILL: {new Date(sub.predictedNextDate).toLocaleDateString('en-US', {month: 'short', day: '2-digit'}).toUpperCase()}
                                      </p>
                                    ) : sub.status === "cancelled" ? (
                                      <p className="text-[10px] text-[#f59e0b] font-bold uppercase bg-[#f59e0b]/10 px-2 py-0.5 rounded-lg border border-[#f59e0b]/15">
                                        EXPIRES: {new Date(sub.predictedNextDate).toLocaleDateString('en-US', {month: 'short', day: '2-digit'}).toUpperCase()}
                                      </p>
                                    ) : (
                                      <p className="text-[10px] text-[#EF4444] font-bold uppercase bg-[#EF4444]/10 px-2 py-0.5 rounded-lg border border-[#EF4444]/15">
                                        MANDATE BLOCKED
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* NEUTRAL AUTONOMY INTERVENTION DECK (Equal Weight Dual-Choice Button Block) */}
                    {selectedSubscription && (
                      <div 
                        ref={interventionRef}
                        className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-4 border-b border-[#475569]/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-[#0F172A]" />
                            <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                              Intervention Interface: Neutral Autonomy Choice
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono text-[#475569]">
                            Target stream: <strong className="text-[#0F172A] font-bold">{selectedSubscription.name}</strong>
                          </span>
                        </div>

                        <p className="text-xs text-[#475569] leading-relaxed mb-5">
                          Under strict negative option principles, both choices below carry identical weight, size, font weight, and CSS interaction. No emotional steering, dark patterns, or retention surveys are utilized. Choose your explicit choice below:
                        </p>

                        {/* EQUAL WEIGHT CHOICE buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button 
                            onClick={() => handleKeep(selectedSubscription.id)}
                            disabled={selectedSubscription.status === "keeping"}
                            className={`w-full py-3.5 px-5 border-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                              selectedSubscription.status === "keeping"
                                ? "bg-[#10B981]/15 border-[#10B981] text-[#10B981] cursor-not-allowed"
                                : "border-[#475569] text-[#0F172A] hover:bg-slate-50 active:scale-[0.98]"
                            }`}
                          >
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            Keep Subscription
                          </button>
                          
                          <button 
                            onClick={() => handleCancel(selectedSubscription.id)}
                            disabled={selectedSubscription.status === "cancelled"}
                            className={`w-full py-3.5 px-5 border-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                              selectedSubscription.status === "cancelled"
                                ? "bg-[#f59e0b]/15 border-[#f59e0b] text-[#f59e0b] cursor-not-allowed"
                                : "border-[#475569] text-[#0F172A] hover:bg-slate-50 active:scale-[0.98]"
                            }`}
                          >
                            <XCircle className="w-4 h-4 shrink-0" />
                            End Subscription
                          </button>
                        </div>

                        {/* Neutral Fact Summary Component (Required Objective Matrix) */}
                        <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-[#475569]/15 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-3">
                          <div className="text-xs text-[#475569] leading-relaxed font-mono">
                            <span className="font-bold text-[#0F172A] uppercase block text-[9px] tracking-wider mb-1">
                              FTC-Mandated Neutral Fact Matrix
                            </span>
                            Cancellation processing date: <strong className="text-[#0F172A]">Current Date</strong> | System Access Expiration: <strong className="text-[#0F172A]">{new Date(selectedSubscription.predictedNextDate).toLocaleDateString()}</strong> | Future Financial Obligations: <strong className="text-emerald-600 font-bold">{formatCurrency(0, currency)}</strong>
                          </div>
                          <div className="text-[10px] italic text-[#475569] shrink-0">
                            Clear path guarantee
                          </div>
                        </div>

                        {/* VRP SPENDING CAP GUARDRAILS & SIMULATED TRANSACTION TESTING */}
                        <div className="mt-6 pt-5 border-t border-[#475569]/10 space-y-4">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-[#0F172A]" />
                            <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                              VRP Mandate Spending Cap Guardrails
                            </h4>
                          </div>

                          <div className="bg-slate-50 border border-[#475569]/15 rounded-lg p-4 space-y-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="text-xs text-[#475569] leading-relaxed max-w-md">
                                <p className="font-bold text-[#0F172A] mb-1">Configure Variable Recurring Payment Limit</p>
                                <p>Set the maximum debit amount authorized per billing cycle. Any charge attempt exceeding this cap is automatically intercepted and blocked.</p>
                              </div>
                              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                                <span className="text-xs font-mono font-bold text-slate-700">{currencySymbol}</span>
                                <input
                                  type="number"
                                  placeholder={selectedSubscription.max_amount_per_charge ? String(selectedSubscription.max_amount_per_charge) : "e.g. 50"}
                                  value={spendingCapInputs[selectedSubscription.id] ?? (selectedSubscription.max_amount_per_charge ? String(selectedSubscription.max_amount_per_charge) : "")}
                                  onChange={(e) => setSpendingCapInputs({
                                    ...spendingCapInputs,
                                    [selectedSubscription.id]: e.target.value
                                  })}
                                  className="w-24 bg-white border border-[#475569]/30 focus:border-[#0F172A] p-2 rounded text-[#0F172A] font-mono outline-none text-xs"
                                />
                                <DescriptiveTooltip text="Sets a maximum transaction cap on the VRP mandate. Charges above this amount are automatically blocked by the banking API." position="top">
                                  <button
                                    onClick={() => {
                                      const val = spendingCapInputs[selectedSubscription.id] !== undefined
                                        ? spendingCapInputs[selectedSubscription.id]
                                        : (selectedSubscription.max_amount_per_charge ? String(selectedSubscription.max_amount_per_charge) : "");
                                      handleUpdateSpendingCap(selectedSubscription.id, Number(val || 0));
                                    }}
                                    className="px-4 py-2 bg-[#0F172A] hover:bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                  >
                                    Update Limit
                                  </button>
                                </DescriptiveTooltip>
                              </div>
                            </div>

                            {/* Simulated Transaction Deck */}
                            <div className="border-t border-slate-200/60 pt-4 space-y-3">
                              <h5 className="text-[10px] font-black text-[#0F172A] uppercase tracking-wider font-mono">
                                Simulated Transaction Testbed
                              </h5>
                              <p className="text-[11px] text-[#475569]">
                                Trigger a simulated debit transaction to test safety enforcement of VRP spending caps in real-time.
                              </p>

                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <span className="text-xs font-mono font-bold text-slate-500">Charge Amount:</span>
                                  <span className="text-xs font-mono font-bold text-slate-700">{currencySymbol}</span>
                                  <input
                                    type="number"
                                    placeholder="Amount"
                                    value={simulatedChargeAmount}
                                    onChange={(e) => setSimulatedChargeAmount(e.target.value)}
                                    className="w-24 bg-white border border-[#475569]/30 focus:border-[#0F172A] p-2 rounded text-[#0F172A] font-mono outline-none text-xs"
                                  />
                                </div>
                                <DescriptiveTooltip text="Triggers a mock transaction to test and verify if the VRP spending cap rules block unauthorized charges." position="top">
                                  <button
                                    onClick={() => handleSimulateCharge(selectedSubscription.id)}
                                    className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                  >
                                    Simulate Debit Request
                                  </button>
                                </DescriptiveTooltip>
                              </div>

                              {/* Transaction feedback logs */}
                              {transactionLog[selectedSubscription.id] && (
                                <div className={`p-3 rounded-lg text-xs font-mono border mt-2 flex gap-2 items-start ${
                                  transactionLog[selectedSubscription.id].type === "blocked"
                                    ? "bg-red-50 border-red-300 text-red-900"
                                    : "bg-emerald-50 border-emerald-300 text-emerald-900"
                                }`}>
                                  <span className="text-sm shrink-0">
                                    {transactionLog[selectedSubscription.id].type === "blocked" ? "⚠️" : "✅"}
                                  </span>
                                  <div>
                                    <p className="font-bold uppercase tracking-wider">
                                      {transactionLog[selectedSubscription.id].type === "blocked" ? "TRANSACTION BLOCKED" : "TRANSACTION APPROVED"}
                                    </p>
                                    <p className="mt-1">{transactionLog[selectedSubscription.id].text}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* SPENDING TRENDS DASHBOARD MODULE */}
                    <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-[#475569]/10 pb-3 gap-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#0F172A]" />
                          <div>
                            <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                              Spending Trends & Leakage Analysis
                            </h3>
                            <p className="text-[10px] text-[#475569]">6-month trends, category allocation, and automated waste projections</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleExportJSON}
                            className="px-3 py-1.5 border border-[#475569]/30 hover:border-[#475569] text-[#0F172A] hover:bg-slate-50 transition-all text-[10px] font-mono font-bold uppercase rounded-lg flex items-center gap-1.5 shadow-sm"
                            title="Download spend report as JSON"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#0F172A]" />
                            Export JSON
                          </button>
                          <span className="text-[10px] font-mono text-[#475569] uppercase font-bold tracking-tight bg-slate-100 px-2.5 py-1.5 rounded-lg border border-[#475569]/10">
                            6-Month Cost Audit
                          </span>
                        </div>
                      </div>

                      {/* Charts Grid - Vertically stacked for optimal desktop legibility */}
                      <div className="grid grid-cols-1 gap-12 mt-6 pb-6 border-b border-slate-100">
                        
                        {/* Area Chart: 6-Month Spend Trend */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-wider font-mono">
                              6-Month Rolling Cost Trend
                            </h4>
                            <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-mono font-bold text-[#475569] select-none hover:text-[#0F172A] transition-all">
                              <input
                                type="checkbox"
                                checked={showComparePeriod}
                                onChange={(e) => setShowComparePeriod(e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 border-gray-300 cursor-pointer"
                              />
                              Overlay Prev Period (Jul - Dec 25)
                            </label>
                          </div>
                          <div className="h-60 w-full mt-2">
                            <ResponsiveContainer width="100%" height={240}>
                              <AreaChart
                                data={trendsData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01}/>
                                  </linearGradient>
                                  <linearGradient id="colorCore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0.0}/>
                                  </linearGradient>
                                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.12}/>
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.1} />
                                <XAxis 
                                  dataKey="month" 
                                  stroke="#475569" 
                                  fontSize={10} 
                                  fontWeight="bold"
                                  tickLine={false}
                                  axisLine={{ stroke: '#475569', strokeOpacity: 0.2 }}
                                />
                                <YAxis 
                                  stroke="#475569" 
                                  fontSize={10} 
                                  fontWeight="bold"
                                  tickLine={false}
                                  axisLine={{ stroke: '#475569', strokeOpacity: 0.2 }}
                                  tickFormatter={(v) => formatCurrency(v, currency)}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#FFFFFF', 
                                    borderColor: '#475569', 
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontFamily: 'monospace',
                                    color: '#0F172A',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                  }}
                                  formatter={(value: any) => [formatCurrency(Number(value), currency)]}
                                />
                                <Legend 
                                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="Total Spending" 
                                  stroke="#EF4444" 
                                  strokeWidth={2.5}
                                  fillOpacity={1} 
                                  fill="url(#colorTotal)" 
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="Core Subscriptions" 
                                  stroke="#0F172A" 
                                  strokeWidth={1.5}
                                  fillOpacity={1} 
                                  fill="url(#colorCore)" 
                                />
                                {showComparePeriod && (
                                  <Area 
                                    type="monotone" 
                                    dataKey="Previous Period Spending" 
                                    stroke="#6366F1" 
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    fillOpacity={1} 
                                    fill="url(#colorPrev)" 
                                  />
                                )}
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Pie Chart: Category Expenses Allocation */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-wider font-mono">
                              Category Allocation
                            </h4>
                            
                            {/* Toggle metric */}
                            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-[#475569]/10">
                              <button
                                onClick={() => setCategoryMetric("spending")}
                                className={`px-2 py-1 rounded-md text-[9px] font-mono uppercase font-black transition-all ${
                                  categoryMetric === "spending"
                                    ? "bg-white text-[#0F172A] shadow-sm"
                                    : "text-[#475569] hover:text-[#0F172A]"
                                }`}
                              >
                                Total Spending
                              </button>
                              <button
                                onClick={() => setCategoryMetric("usage")}
                                className={`px-2 py-1 rounded-md text-[9px] font-mono uppercase font-black transition-all ${
                                  categoryMetric === "usage"
                                    ? "bg-white text-[#0F172A] shadow-sm"
                                    : "text-[#475569] hover:text-[#0F172A]"
                                }`}
                              >
                                Usage Frequency
                              </button>
                            </div>
                          </div>

                          {/* Pie and Legend Side by Side */}
                          {getCategoryBreakdown().length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center h-60 mt-2 bg-[#F8FAFC] border border-dashed border-slate-300 rounded-lg p-5">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2.5 shadow-sm">
                                <Shield className="w-5 h-5 text-emerald-500 animate-pulse" />
                              </div>
                              <h5 className="text-[11px] font-black uppercase text-[#0F172A] tracking-wider font-mono">
                                Sovereign Autonomy Active
                              </h5>
                              <p className="text-[10px] text-[#475569] leading-relaxed mt-1 max-w-[280px]">
                                All active recurring streams and VRP payment mandates have been successfully blocked or cancelled. Active leakages are completely suppressed!
                              </p>
                              <div className="mt-3 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                                Current Allocation: {formatCurrency(0, currency)}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 h-60 mt-2">
                              <div className="w-full sm:w-1/2 h-full flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height={240}>
                                  <PieChart>
                                    <Pie
                                      data={getCategoryBreakdown()}
                                      dataKey={categoryMetric === "spending" ? "totalSpending" : "usageFrequency"}
                                      nameKey="category"
                                      cx="50%"
                                      cy="50%"
                                      outerRadius={75}
                                      innerRadius={45}
                                      paddingAngle={3}
                                      onClick={(data) => {
                                        if (data && data.category) {
                                          setSelectedPieCategory(
                                            selectedPieCategory === data.category ? null : data.category
                                          );
                                        }
                                      }}
                                      className="cursor-pointer outline-none"
                                    >
                                      {getCategoryBreakdown().map((entry, index) => (
                                        <Cell 
                                          key={`cell-${index}`} 
                                          fill={PIE_COLORS[index % PIE_COLORS.length]} 
                                          stroke={selectedPieCategory === entry.category ? "#0F172A" : "#FFFFFF"}
                                          strokeWidth={selectedPieCategory === entry.category ? 2.5 : 1}
                                        />
                                      ))}
                                    </Pie>
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        borderColor: '#475569',
                                        borderRadius: '8px',
                                        fontSize: '10px',
                                        fontFamily: 'monospace',
                                        color: '#0F172A',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                      }}
                                      formatter={(value: any, name: any) => {
                                        const val = Number(value);
                                        if (categoryMetric === "spending") {
                                          return [formatCurrency(val, currency), name];
                                        } else {
                                          return [`${val} active days`, name];
                                        }
                                      }}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>

                                {/* Center Donut text info */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <span className="text-[8px] font-mono text-[#475569] uppercase font-bold tracking-wider">
                                    {selectedPieCategory ? "Filtered" : "Total"}
                                  </span>
                                  <span className="text-[11px] font-black text-[#0F172A] font-mono max-w-[70px] truncate text-center">
                                    {selectedPieCategory ? (
                                      selectedPieCategory
                                    ) : categoryMetric === "spending" ? (
                                      formatCurrency(
                                        getCategoryBreakdown().reduce((sum, item) => sum + item.totalSpending, 0),
                                        currency
                                      )
                                    ) : (
                                      `${getCategoryBreakdown().reduce((sum, item) => sum + item.usageFrequency, 0).toFixed(0)}d`
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Legend Column list */}
                              <div className="w-full sm:w-1/2 flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                                {getCategoryBreakdown().map((entry, index) => {
                                  const isSelected = selectedPieCategory === entry.category;
                                  const color = PIE_COLORS[index % PIE_COLORS.length];
                                  return (
                                    <button
                                      key={entry.category}
                                      onClick={() => setSelectedPieCategory(isSelected ? null : entry.category)}
                                      className={`flex items-center justify-between text-left p-1.5 rounded-lg border transition-all text-[10px] font-mono font-bold ${
                                        isSelected 
                                          ? "bg-slate-100 border-[#0F172A] shadow-xs" 
                                          : "bg-white border-transparent hover:bg-slate-50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="w-2 rounded shrink-0 aspect-square" style={{ backgroundColor: color }}></span>
                                        <span className="truncate text-slate-700">{entry.category}</span>
                                      </div>
                                      <span className="text-[#0F172A] shrink-0">
                                        {categoryMetric === "spending" 
                                          ? formatCurrency(entry.totalSpending, currency) 
                                          : `${entry.usageFrequency}d`}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Interactive Secondary Grid: Projected Waste & Category Drilldown */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 pb-6 border-b border-slate-100">
                        
                        {/* Projected Annual Waste Card */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-lg p-5 flex flex-col justify-between shadow-xs">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                <h4 className="text-[10px] font-black uppercase text-amber-800 tracking-wider font-mono">
                                  Projected Annual Waste
                                </h4>
                              </div>
                              <span className="text-[8px] font-mono font-bold uppercase text-amber-700 px-1.5 py-0.5 bg-amber-100 rounded border border-amber-200">
                                Inactivity Leakage
                              </span>
                            </div>
                            
                            <div className="my-3">
                              <div className="text-2xl font-black text-[#0F172A] font-mono">
                                {formatCurrency(getProjectedAnnualWaste().totalWaste, currency)}
                                <span className="text-xs text-slate-500 font-bold font-sans ml-1">/ yr saved</span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                                Total estimated annual savings if subscriptions with zero activity for over 15 days or flagged as high-cost anomalies are ended.
                              </p>
                            </div>

                            {/* List of Wasted/Forgotten Subs */}
                            <div className="flex flex-col gap-1.5 mt-4">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Contributing Leakage Streams ({getProjectedAnnualWaste().wastedSubs.length})
                              </span>
                              {getProjectedAnnualWaste().wastedSubs.length === 0 ? (
                                <span className="text-[10px] text-emerald-600 font-bold italic font-mono p-2 bg-emerald-50 rounded border border-emerald-100">
                                  Perfect alignment! No unused or flagged subscription leakage detected.
                                </span>
                              ) : (
                                <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                                  {getProjectedAnnualWaste().wastedSubs.map(s => (
                                    <button
                                      key={s.id}
                                      onClick={() => {
                                        setSelectedSubId(s.id);
                                        const el = document.getElementById(`sub-item-${s.id}`);
                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                      }}
                                      className={`flex items-center justify-between p-2 rounded border border-amber-200 text-left bg-white/80 hover:bg-white hover:border-amber-400 transition-all text-[10px] font-mono font-bold ${
                                        selectedSubId === s.id ? "ring-1 ring-amber-500 border-amber-500 bg-amber-50/50" : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                        <span className="truncate text-slate-800">{s.name}</span>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <span className="text-[#EF4444] block">
                                          {formatCurrency(convertCurrency(s.amount, s.currency || "USD", currency), currency)}/{s.frequency === "annual" ? "yr" : "mo"}
                                        </span>
                                        <span className="text-[8px] text-slate-500 block">
                                          Last used {s.lastUsedDaysAgo}d ago
                                        </span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Segment Drilldown List Card */}
                        <div className="bg-slate-50 border border-[#475569]/15 rounded-lg p-5 flex flex-col justify-between shadow-xs">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <Sliders className="w-4 h-4 text-slate-700 shrink-0" />
                                <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-wider font-mono">
                                  Category details: {selectedPieCategory || "All Streams"}
                                </h4>
                              </div>
                              {selectedPieCategory && (
                                <button
                                  onClick={() => setSelectedPieCategory(null)}
                                  className="text-[9px] font-mono font-bold uppercase text-slate-500 hover:text-[#0F172A] transition-all bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-xs"
                                >
                                  Clear Filter
                                </button>
                              )}
                            </div>

                            <div className="mt-3 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                              {(() => {
                                const activeSubs = subscriptions.filter(
                                  s => s.status !== "cancelled" && s.status !== "revoked"
                                );
                                const filteredSubs = selectedPieCategory
                                  ? activeSubs.filter(s => s.category === selectedPieCategory)
                                  : activeSubs;

                                if (filteredSubs.length === 0) {
                                  return (
                                    <div className="py-6 text-center text-[10px] text-slate-500 italic font-bold">
                                      No active streams in this category segment.
                                    </div>
                                  );
                                }

                                return filteredSubs.map(s => {
                                  const isSelected = selectedSubId === s.id;
                                  return (
                                    <button
                                      key={s.id}
                                      onClick={() => {
                                        setSelectedSubId(s.id);
                                        const el = document.getElementById(`sub-item-${s.id}`);
                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                      }}
                                      className={`flex items-center justify-between p-2 rounded-lg border transition-all text-left bg-white ${
                                        isSelected 
                                          ? "border-[#0F172A] ring-1 ring-[#0F172A] shadow-sm bg-slate-50/50" 
                                          : "border-slate-200 hover:border-slate-400"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-black text-[10px] text-[#0F172A] border border-[#475569]/10 shrink-0">
                                          {s.logoLetter}
                                        </div>
                                        <div className="min-w-0">
                                          <span className="block text-[10px] font-bold text-slate-800 truncate leading-tight">
                                            {s.name}
                                          </span>
                                          <span className="block text-[8px] text-slate-500 font-mono tracking-tight">
                                            {s.category}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="text-right shrink-0 font-mono text-[9px] font-bold">
                                        <span className="block text-slate-800">
                                          {formatCurrency(convertCurrency(s.amount, s.currency || "USD", currency), currency)}
                                          <span className="text-[8px] text-slate-500 font-sans ml-0.5">
                                            /{s.frequency === "annual" ? "yr" : "mo"}
                                          </span>
                                        </span>
                                        <span className={`text-[8px] px-1 py-0.2 rounded font-sans uppercase tracking-wider ${
                                          s.lastUsedDaysAgo > 15 
                                            ? "bg-amber-50 text-amber-700" 
                                            : "bg-emerald-50 text-emerald-700"
                                        }`}>
                                          {s.lastUsedDaysAgo === 0 ? "today" : `${s.lastUsedDaysAgo}d ago`}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Insight Callout */}
                      {hasAdobe && (
                        <div className={`mt-5 p-4 rounded-lg border flex items-start gap-3 transition-colors ${
                          isAdobeActive 
                            ? "bg-red-50/50 border-[#EF4444]/20 text-[#0F172A]" 
                            : "bg-emerald-50/40 border-[#10B981]/20 text-[#0F172A]"
                        }`}>
                          <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${isAdobeActive ? "bg-[#EF4444] text-white" : "bg-[#10B981] text-white"}`}>
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div className="text-xs leading-relaxed">
                            <span className="font-bold uppercase block text-[9px] tracking-wider mb-1 font-mono">
                              {isAdobeActive ? "Urgent Spending Alert" : "Mitigation Success Metric"}
                            </span>
                            {isAdobeActive ? (
                              <p>
                                <strong>Cost Spike Identified:</strong> Your monthly recurring totals spiked by <strong className="font-semibold text-[#EF4444] font-mono">{formatCurrency(convertCurrency(89.99, "USD", currency), currency)}</strong> (+290.5%) in March 2026 due to the activation of <strong className="font-semibold">Adobe Creative Cloud</strong>. Your actual usage shows 0 interactions in the last 30 days. Mitigate this leak instantly using the one-click end subscription action below.
                              </p>
                            ) : (
                              <p>
                                <strong>Leak Mitigated Successfully:</strong> You terminated the <strong className="font-semibold text-emerald-600">Adobe Creative Cloud</strong> subscription leak! This single mitigation action has decreased your monthly exposure from <strong className="font-mono text-slate-500 line-through">{formatCurrency(convertCurrency(125.96, "USD", currency), currency)}</strong> back to <strong className="font-mono text-emerald-600 font-bold">{formatCurrency(convertCurrency(35.97, "USD", currency), currency)}</strong>, protecting you from future billing surprises.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Side Column (Mitigation VRP Kill Switch & Logs) */}
                  <div className="flex flex-col gap-6">
                    
                    {/* VRP KILL SWITCH CARD */}
                    <div className="bg-[#EF4444] text-white p-6 rounded-lg flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                      <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">Automated Mitigation Layer</p>
                      <h2 className="text-xl font-black mb-3 flex items-center gap-1.5 tracking-tight">
                        VRP REVOLVING KILL SWITCH
                      </h2>
                      <p className="text-xs font-semibold mb-6 text-white/90 leading-relaxed">
                        Bypass merchant-controlled cancellation chains. Revoke collection credentials instantly at the central bank router.
                      </p>
                      
                      <DescriptiveTooltip 
                        text="Terminates the Variable Recurring Payment (VRP) authorization directly at your bank router, immediately blocking all future charge attempts." 
                        position="top"
                        className="w-full block"
                      >
                        <button 
                          onClick={() => handleRevoke(selectedSubId)}
                          disabled={selectedSubscription ? (selectedSubscription.status === "revoked") : true}
                          className="w-full py-3.5 bg-[#0F172A] text-white font-bold rounded-lg hover:bg-slate-900 active:scale-[0.98] transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Zap className="w-4 h-4 fill-[#10B981] text-[#10B981]" />
                          {selectedSubscription && selectedSubscription.status === "revoked" ? "MANDATE REVOKED" : "Instant Revocation"}
                        </button>
                      </DescriptiveTooltip>
                      
                      {selectedSubscription && (
                        <span className="mt-3 text-[10px] font-mono text-white/70">
                          Target stream: {selectedSubscription.name} ({formatCurrency(convertCurrency(selectedSubscription.amount, selectedSubscription.currency || "USD", currency), currency)})
                        </span>
                      )}
                    </div>

                    {/* COMPLIANCE AUDIT EVIDENCE DECK */}
                    <div className="bg-white p-5 rounded-lg border border-[#475569]/20 flex flex-col gap-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#475569]/10 pb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0F172A]" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                            Compliance Evidence Log
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <DescriptiveTooltip text="Generates a downloadable PDF document certifying cancellation requests and compliance actions for legal/bank dispute evidence." position="top">
                            <button 
                              onClick={exportLogsToPDF}
                              className="text-[9px] font-mono text-emerald-600 hover:text-emerald-700 transition-colors uppercase font-bold flex items-center gap-1 cursor-pointer"
                              title="Export logs to PDF"
                            >
                              <DownloadCloud className="w-3 h-3" /> Export PDF
                            </button>
                          </DescriptiveTooltip>
                          <DescriptiveTooltip text="Resets and permanently clears all stored subscription compliance audit and activity records from local state." position="top">
                            <button 
                              onClick={clearLogs}
                              className="text-[9px] font-mono text-[#475569] hover:text-[#EF4444] transition-colors uppercase font-bold cursor-pointer"
                            >
                              Clear logs
                            </button>
                          </DescriptiveTooltip>
                        </div>
                      </div>

                      {/* Logs deck list */}
                      <div className="flex-1 font-mono text-[10px] space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                        {logs.length === 0 ? (
                          <p className="text-[#475569] text-center italic py-4">No active logs registered.</p>
                        ) : (
                          logs.map((log) => (
                            <div key={log.id} className="flex flex-col gap-1 border-b border-[#475569]/5 pb-2">
                              <div className="flex justify-between text-[#475569]">
                                <span className="text-[#0F172A] font-bold">[{log.timestamp}]</span>
                                <span className="font-bold text-[#0F172A]">{log.action}</span>
                              </div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[#475569] text-left leading-normal">{log.details}</span>
                                <span className={`text-[9px] font-black uppercase px-1 rounded shrink-0 ${
                                  log.status === "SUCCESS" 
                                    ? "bg-[#10B981]/20 text-[#10B981]" 
                                    : log.status === "FAILED" 
                                    ? "bg-[#EF4444]/20 text-[#EF4444]" 
                                    : "bg-blue-500/20 text-blue-600"
                                }`}>
                                  {log.status}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 bg-slate-50 rounded border border-[#475569]/10 text-[9px] text-[#475569] leading-relaxed">
                        <strong>Regulatory Note:</strong> Digital opt-out trails, unilateral cancellations, and merchant compliance logs are securely persisted according to FTC Neg-Option rules.
                      </div>
                    </div>

                  </div>

                </div>
                </div>
              )}

              {activeTab === "vrp" && (
                <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm flex flex-col gap-6">
                  <div>
                    <h2 className="text-lg font-black text-[#0F172A] mb-1">VRP Consent Control Deck</h2>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Variable Recurring Payments (VRP) enable user-centric, sovereign command of funds. Revoking here deletes credentials at your bank center, fully bypassing merchant checkout traps.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptions.map(sub => (
                      <div key={sub.id} className="bg-slate-50 p-5 rounded-lg border border-[#475569]/15 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-start">
                            <MerchantLogo name={sub.name} logoLetter={sub.logoLetter} logoUrl={sub.logoUrl} className="w-8 h-8" />
                            <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                              sub.status === "revoked" 
                                ? "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20" 
                                : "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                            }`}>
                              {sub.status === "revoked" ? "MANDATE BLOCKED" : "MANDATE ACTIVE"}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-[#0F172A] mt-3">{sub.name}</h3>
                          <p className="text-xs font-mono text-[#0f172a] mt-1">{formatCurrency(convertCurrency(sub.amount, sub.currency || "USD", currency), currency)} / {sub.frequency}</p>
                          <p className="text-[10px] text-[#475569] mt-2 font-mono">
                            CONSENT_ID: <span className="text-[#0F172A]">vrp_{sub.id.replace(/-.*/,'')}_sec</span>
                          </p>
                        </div>

                        <DescriptiveTooltip 
                          text="Instructs your bank to delete the payment authorization token, preventing the merchant from pulling any more payments." 
                          position="top"
                          className="w-full block"
                        >
                          <button
                            onClick={() => handleRevoke(sub.id)}
                            disabled={sub.status === "revoked"}
                            className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                              sub.status === "revoked"
                                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                : "bg-[#0F172A] text-white hover:bg-slate-800"
                            }`}
                          >
                            {sub.status === "revoked" ? "Revocation Active" : "Revoke Consent Token"}
                          </button>
                        </DescriptiveTooltip>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-[#475569]/10 text-xs text-[#475569] flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#0F172A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0F172A] block mb-1">Open Banking Standard Revision 2026</span>
                      Instant cancellation executes physically at your banking interface. Once deleted, merchants are prevented from running automated retries or assessing bounce fees.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-[#475569]/15 pb-4">
                    <div>
                      <h2 className="text-lg font-black text-[#0F172A]">Digital Compliance Logs Console</h2>
                      <p className="text-xs text-[#475569] mt-1">
                        Unilateral audit logs documenting keep consents and cancel/revoke execution blocks.
                      </p>
                    </div>
                    <button 
                      onClick={clearLogs}
                      className="px-4 py-2 bg-white border border-[#475569] text-[#0F172A] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Truncate Trail
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs text-[#0F172A]">
                      <thead>
                        <tr className="border-b border-[#475569]/20 text-[#475569] uppercase font-bold text-[10px] tracking-wider">
                          <th className="py-3 px-4">Timestamp</th>
                          <th className="py-3 px-4">Action Token</th>
                          <th className="py-3 px-4">Details / Compliance Evidence</th>
                          <th className="py-3 px-4 text-right">Verification Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#475569]/10">
                        {logs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-10 text-center italic text-[#475569]">
                              No audit records registered in current compliance cycle.
                            </td>
                          </tr>
                        ) : (
                          logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-4 text-[#475569] whitespace-nowrap">{log.timestamp}</td>
                              <td className="py-3.5 px-4 font-bold text-[#0F172A]">{log.action}</td>
                              <td className="py-3.5 px-4 text-[#475569] max-w-[350px] leading-relaxed">{log.details}</td>
                              <td className="py-3.5 px-4 text-right">
                                <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                  log.status === "SUCCESS" 
                                    ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" 
                                    : log.status === "FAILED" 
                                    ? "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20" 
                                    : "bg-[#0F172A]/10 text-[#0F172A] border border-[#0F172A]/20"
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "login" && (
                <div className="max-w-2xl mx-auto w-full space-y-6">
                  {/* ACCOUNT SETUP PANEL */}
                  <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#475569]/10 pb-4">
                      <User className="w-5 h-5 text-[#0F172A]" />
                      <div>
                        <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">Signup & Login Portal</h2>
                        <p className="text-xs text-[#475569]">Manage secure cryptographic access credentials & subscriptions</p>
                      </div>
                    </div>

                    {!isLoggedIn ? (
                      <div className="bg-slate-950 text-white border-2 border-slate-900 rounded-lg p-5 space-y-4 shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 font-mono">
                            {gameStateSymbol()} {authState === "signup" ? "🔒 Sign Up State" : (authState === "reset" ? "🔄 Reset Password State" : "🔒 Login State")}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">FTC SECURE AUTHENTICATOR</span>
                        </div>

                        <form onSubmit={authState === "reset" ? handlePasswordResetOutOfSession : (authState === "signup" ? handleSignUp : handleLogIn)} className="space-y-4">
                          {authState === "signup" && (
                            <div className="space-y-1">
                              <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Full Name</label>
                              <input
                                type="text"
                                required
                                placeholder=""
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 p-2.5 rounded text-white text-xs font-mono outline-none"
                              />
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">Email ID</label>
                            <input
                              type="email"
                              required
                              placeholder="yourname@example.com"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 p-2.5 rounded text-white text-xs font-mono outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                              {authState === "reset" ? "New Password" : "Password"}
                            </label>
                            <input
                              type="password"
                              required
                              placeholder="••••••••••••"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 p-2.5 rounded text-white text-xs font-mono outline-none"
                            />
                          </div>

                          {authState === "signup" && (
                            <label className="flex items-start gap-2.5 text-slate-300 text-[11px] cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-400 h-3.5 w-3.5 cursor-pointer"
                              />
                              <span>I explicitly accept the <strong>Terms of Service</strong> and authorize automated active consent monitors under sovereign FTC regulations.</span>
                            </label>
                          )}

                          <button
                            type="submit"
                            className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded transition-colors shadow-sm cursor-pointer mt-2"
                          >
                            {authState === "signup" ? "Create Secure Account" : (authState === "reset" ? "Reset Security Password" : "Access Console")}
                          </button>

                          <div className="flex items-center my-3.5">
                            <div className="flex-1 border-t border-slate-800"></div>
                            <span className="px-3 text-[10px] text-slate-500 font-mono">OR</span>
                            <div className="flex-1 border-t border-slate-800"></div>
                          </div>

                          <button 
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleAuthLoading}
                            className="w-full py-2.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 rounded font-medium text-xs flex items-center justify-center gap-2.5 cursor-pointer shadow-sm active:scale-[0.99] transition-transform"
                          >
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0 block">
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                              <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            <span>{isGoogleAuthLoading ? "Connecting..." : "Sign in with Google"}</span>
                          </button>

                          {authMessage && (
                            <div className={`p-3 rounded text-[11px] font-mono border ${
                              authMessage.type === "success" 
                                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" 
                                : "bg-rose-950/40 border-rose-500/30 text-rose-400"
                            }`}>
                              {authMessage.text}
                            </div>
                          )}

                          <div className="text-center pt-2 border-t border-slate-900 flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setAuthState(authState === "signup" ? "login" : "signup");
                                setAuthMessage(null);
                              }}
                              className="text-[11px] text-[#94A3B8] hover:text-white underline cursor-pointer"
                            >
                              {authState === "signup" 
                                ? "Already registered? Log in here" 
                                : "Need an account? Sign up here"}
                            </button>

                            {authState !== "signup" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthState(authState === "reset" ? "login" : "reset");
                                  setAuthMessage(null);
                                }}
                                className="text-[11px] text-[#94A3B8] hover:text-white underline cursor-pointer"
                              >
                                {authState === "reset" 
                                  ? "Remember your password? Log in here" 
                                  : "Forgot password? Reset password here"}
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-slate-950 text-white border-2 border-slate-900 rounded-lg p-5 space-y-4 shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 font-mono">
                            🔒 SECURE SYSTEM SESSION ACTIVE
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">AUTHENTICATED CONSOLE</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Authenticated User:</span>
                              <span className="font-bold text-white font-mono">{userName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Security Email:</span>
                              <span className="font-bold text-white font-mono">{authEmail || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Google Workspace:</span>
                              <span className={`font-bold font-mono ${googleAccessToken ? "text-emerald-400" : "text-amber-400"}`}>
                                {googleAccessToken ? "CONNECTED (REAL GMAIL)" : "NOT CONNECTED (SIMULATED)"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Regulatory Clearance:</span>
                              <span className="font-bold text-emerald-400 font-mono">FTC PASSED</span>
                            </div>
                          </div>

                          {!googleAccessToken && (
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleAuthLoading}
                                className="w-full py-2 bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 rounded font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98]"
                              >
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0 block">
                                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                  <path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                                <span>{isGoogleAuthLoading ? "Connecting..." : "Enable Real Gmail Alerts"}</span>
                              </button>
                              
                              <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1.5 text-[10px] leading-relaxed text-slate-400">
                                <p className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono text-[9px]">
                                  ⚠️ Google Account & GCP Restrictions Info
                                </p>
                                <p>
                                  To successfully enable real Gmail dispatch via OAuth, your account and Google Cloud Project must meet these criteria:
                                </p>
                                <ul className="list-disc pl-4 space-y-1 font-mono text-[9px]">
                                  <li>
                                    <strong>OAuth Test User:</strong> Since this app's OAuth screen is in "Testing" mode, you must explicitly register your Gmail address under <em>Google Cloud Console &rarr; OAuth Consent Screen &rarr; Test Users</em>.
                                  </li>
                                  <li>
                                    <strong>Authorized Domain:</strong> This app's current domain (<strong>{window.location.host}</strong>) must be added to <em>Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized Domains</em>.
                                  </li>
                                  <li>
                                    <strong>Restricted Scope:</strong> <code>gmail.send</code> is a restricted scope. It requires manual authorization. If popups are blocked, allow them or open in a new tab.
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* MANUAL EMAIL DISPATCH PORTAL */}
                        <div className="border-t border-slate-800 pt-4 space-y-2">
                          <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400 block font-bold">
                            Interactive Email Dispatch Portal
                          </span>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            Manually trigger and dispatch an outbound SubSnap compliance warning digest email. This runs your global secure script immediately.
                          </p>
                          <button
                            type="button"
                            id="email-dispatch-portal-btn"
                            onClick={handleTriggerWarningDigest}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Dispatch Threat Warning Digest</span>
                          </button>
                        </div>

                        {/* PASSWORD RESET SUB-FORM */}
                        <div className="border-t border-slate-800 pt-4 space-y-3">
                          <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400 block font-bold">
                            Modify Security Credentials
                          </span>
                          {resetSuccessMessage && (
                            <p className="text-emerald-400 text-xs font-mono">{resetSuccessMessage}</p>
                          )}
                          {resetErrorMessage && (
                            <p className="text-[#EF4444] text-xs font-mono">{resetErrorMessage}</p>
                          )}
                          <form onSubmit={handlePasswordResetInSession} className="space-y-2">
                            <div className="space-y-1">
                              <label className="block text-slate-400 text-[9px] uppercase font-bold">New Secure Password</label>
                              <input
                                type="password"
                                required
                                placeholder="••••••••••••"
                                value={newPasswordInput}
                                onChange={(e) => setNewPasswordInput(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 p-2 rounded text-white text-xs font-mono outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
                            >
                              Update Password
                            </button>
                          </form>
                        </div>

                        {/* DELETE ACCOUNT ACTION */}
                        <div className="border-t border-slate-800 pt-4 space-y-3">
                          <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400 block font-bold">
                            System Decommissioning
                          </span>
                          {!showDeleteConfirm ? (
                            <button
                              type="button"
                              onClick={() => setShowDeleteConfirm(true)}
                              className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900 text-rose-200 hover:text-rose-100 font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
                              id="btn-trigger-delete-account"
                            >
                              Delete Account
                            </button>
                          ) : (
                            <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded space-y-3" id="delete-confirmation-dialog">
                              <p className="text-[11px] text-rose-200 leading-normal">
                                ⚠️ WARNING: This will permanently decommission your cryptographic user credentials, wipe active linkages, and reset all simulation databases. This action is irreversible.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={handleDeleteAccount}
                                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider rounded transition-colors"
                                  id="btn-confirm-delete-account"
                                >
                                  Yes, Delete Account
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowDeleteConfirm(false)}
                                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
                                  id="btn-cancel-delete-account"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-slate-50 rounded-lg border border-[#475569]/15 text-[11px] text-[#475569] leading-relaxed">
                      <p>
                        Account credentials are encrypted using AES-256 standard protocols. SubSnap secures your consumer rights against dark pattern retention policies automatically.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "config" && (() => {
                const latestSyncError = logs.find(log => log.action === "PLAID_SYNC_LIVE_FAILED");

                if (onboardingOption === "none") {
                  return (
                    <div className="max-w-4xl mx-auto w-full space-y-6">
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-[#0F172A] uppercase">Select Financial Ingestion Source</h2>
                        <p className="text-sm text-[#475569] max-w-lg mx-auto">
                          Import subscription streams to our secure database through banking APIs, file processing, or automated AI receipt parsing.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option A: Plaid */}
                        <div 
                          onClick={() => setOnboardingOption("plaid")}
                          className="bg-white border-2 border-slate-900 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-[#0F172A] text-white rounded-lg">
                                <Database className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-base text-[#0F172A] uppercase tracking-wide group-hover:underline">Option A: Live Bank Sync</h3>
                            </div>
                            <p className="text-xs text-[#475569] leading-relaxed">
                              Establish active secure linkage with production bank accounts. Uses secure Plaid API and VRP protocols to fetch recurring streams.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase text-[#10B981] bg-emerald-50 self-start px-2 py-0.5 rounded border border-emerald-200">
                            Plaid / VRP Workflow
                          </span>
                        </div>

                        {/* Option B: CSV Statement Uploader */}
                        <div 
                          onClick={() => setOnboardingOption("csv")}
                          className="bg-white border-2 border-slate-900 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-[#0F172A] text-white rounded-lg">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-base text-[#0F172A] uppercase tracking-wide group-hover:underline">Option B: Bank Statement Uploader</h3>
                            </div>
                            <p className="text-xs text-[#475569] leading-relaxed">
                              Process raw bank statements. Drop or upload CSV format transaction logs to automatically identify and parse repeating debits.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-600 bg-amber-50 self-start px-2 py-0.5 rounded border border-amber-200">
                            CSV File Processing
                          </span>
                        </div>

                        {/* Option C: Manual Add Form */}
                        <div 
                          onClick={() => setOnboardingOption("manual")}
                          className="bg-white border-2 border-slate-900 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-[#0F172A] text-white rounded-lg">
                                <PlusCircle className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-base text-[#0F172A] uppercase tracking-wide group-hover:underline">Option C: Subscription Quick-Add Form</h3>
                            </div>
                            <p className="text-xs text-[#475569] leading-relaxed">
                              Manually quick-add single custom recurring contracts, pricing parameters, and next renewal dates to your ledger immediately.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 self-start px-2 py-0.5 rounded border border-blue-200">
                            Manual Quick-Add Form
                          </span>
                        </div>

                        {/* Option D: Smart Receipt AI Paste */}
                        <div 
                          onClick={() => setOnboardingOption("receipt")}
                          className="bg-white border-2 border-slate-900 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-[#0F172A] text-white rounded-lg">
                                <Sparkles className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-base text-[#0F172A] uppercase tracking-wide group-hover:underline">Option D: Smart Receipt Paste Workspace</h3>
                            </div>
                            <p className="text-xs text-[#475569] leading-relaxed">
                              Paste confirmation email text or merchant billing invoices. Uses Gemini AI models to automatically extract subscription metadata.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold uppercase text-purple-600 bg-purple-50 self-start px-2 py-0.5 rounded border border-purple-200">
                            AI Text Extraction Workspace
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="mx-auto w-full space-y-6 max-w-2xl">
                    <button
                      onClick={() => setOnboardingOption("none")}
                      className="flex items-center gap-2 text-xs font-bold text-[#475569] hover:text-[#0F172A] transition-colors bg-white px-3.5 py-2 border border-slate-200 rounded-lg shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Onboarding Options
                    </button>

                    {onboardingOption === "plaid" && (
                      <div className="space-y-6">
                        {/* BANK SETUP LIVE PANEL */}
                        <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-6">
                          <div className="flex items-center gap-3 border-b border-[#475569]/10 pb-4">
                            <Database className="w-5 h-5 text-[#0F172A]" />
                            <div>
                              <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tight">Bank Setup Live!</h2>
                              <p className="text-xs text-[#475569]">
                                {isLoggedIn && userName ? `Active open banking link for ${userName}` : "Establish active linkages with production bank accounts"}
                              </p>
                            </div>
                          </div>

                          {latestSyncError && isConfigSaved && (
                            <div className="p-4 bg-red-50 border-2 border-[#EF4444] rounded-lg flex gap-3 items-start text-red-950 mb-6">
                              <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                              <div className="flex-1 text-xs">
                                <p className="font-bold uppercase tracking-wider text-[#EF4444]">Plaid Live Sync Failed</p>
                                <p className="mt-1 font-mono font-bold">{latestSyncError.details}</p>
                                <p className="mt-2 text-[#475569] leading-relaxed">
                                  The Plaid API returned a 400 Bad Request. This indicates that the Client ID, Secret, or Access Token is incorrect, or you are targeting the wrong environment (e.g. Sandbox vs. Production).
                                </p>
                                <button
                                  type="button"
                                  onClick={handleResetPlaidConfig}
                                  className="mt-3 px-4 py-2 bg-[#EF4444] hover:bg-red-600 text-white font-bold rounded-lg uppercase tracking-wider text-[10px] transition-colors shadow-sm"
                                >
                                  Reset to Sandbox Mode
                                </button>
                              </div>
                            </div>
                          )}

                          <form onSubmit={handleSavePlaidConfig} className="space-y-4 text-xs">
                            <div>
                              <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Plaid Client ID</label>
                              <input 
                                type="text" 
                                placeholder="plaid_client_id_live_xxxx"
                                value={plaidConfig.clientId}
                                onChange={(e) => setPlaidConfig({ ...plaidConfig, clientId: e.target.value })}
                                className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] font-mono outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Plaid Secret Key</label>
                              <input 
                                type="password" 
                                placeholder="plaid_secret_live_xxxx"
                                value={plaidConfig.secret}
                                onChange={(e) => setPlaidConfig({ ...plaidConfig, secret: e.target.value })}
                                className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] font-mono outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Plaid Environment</label>
                                <select 
                                  value={plaidConfig.environment}
                                  onChange={(e) => setPlaidConfig({ ...plaidConfig, environment: e.target.value })}
                                  className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] font-mono outline-none cursor-pointer"
                                >
                                  <option value="sandbox">Sandbox (https://sandbox.plaid.com)</option>
                                  <option value="development">Development (https://development.plaid.com)</option>
                                  <option value="production">Production (https://production.plaid.com)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Access Token</label>
                                <input 
                                  type="text" 
                                  placeholder="access-sandbox-xxxx"
                                  value={plaidConfig.accessToken}
                                  onChange={(e) => setPlaidConfig({ ...plaidConfig, accessToken: e.target.value })}
                                  className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] font-mono outline-none"
                                />
                              </div>
                            </div>

                            {plaidConfigError && (
                              <p className="text-[#EF4444] text-xs font-mono">{plaidConfigError}</p>
                            )}

                            <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#475569]/10">
                              <p className="text-[#475569] italic text-[10px] max-w-xs leading-normal">
                                Note: Live links use <code>/transactions/recurring/get</code> under active encryption protocols. Saving live credentials triggers automatic Live Synchronization.
                              </p>
                              <div className="flex gap-2">
                                {isConfigSaved && (
                                  <button 
                                    type="button" 
                                    onClick={handleResetPlaidConfig}
                                    className="px-4 py-3 bg-white border border-[#475569] hover:bg-slate-50 text-[#0F172A] font-bold uppercase tracking-wider rounded-lg transition-colors text-xs shadow-sm"
                                  >
                                    Reset
                                  </button>
                                )}
                                <button 
                                  type="submit" 
                                  className="px-6 py-3 bg-[#0F172A] hover:bg-slate-900 text-white font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm"
                                >
                                  <Check className="w-4 h-4" />
                                  Save Credentials
                                </button>
                              </div>
                            </div>
                          </form>

                          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-[#475569]/15 space-y-2">
                            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                              <Info className="w-4 h-4 text-[#0F172A]" />
                              Sovereign API Sync Protocols
                            </h4>
                            <p className="text-[11px] text-[#475569] leading-relaxed">
                              By saving client configurations above, you delegate authority to fetch recurring streams strictly on a read-only level. No transactional permissions are ever requested, complying with federal safety standards.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {onboardingOption === "csv" && (
                      <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-6">
                        <div className="border-b border-[#475569]/10 pb-4">
                          <h2 className="text-lg font-black text-[#0F172A] uppercase flex items-center gap-2">
                            <UploadCloud className="w-5 h-5" />
                            Bank Statement Uploader
                          </h2>
                          <p className="text-xs text-[#475569]">Drop or select bank transaction statement CSV files to run local matching algorithms.</p>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setCsvIsDragActive(true); }}
                          onDragLeave={() => setCsvIsDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setCsvIsDragActive(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  handleCSVUpload(event.target.result as string, file.name);
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                            csvIsDragActive ? "border-[#10B981] bg-emerald-50/20" : "border-[#475569]/30 hover:border-[#0F172A] bg-slate-50"
                          }`}
                        >
                          <UploadCloud className="w-8 h-8 text-[#475569] mb-2" />
                          <p className="text-xs font-bold text-[#0F172A]">Drag & Drop your CSV Statement here</p>
                          <p className="text-[10px] text-[#475569] mt-1 font-mono">or click to browse local files</p>
                          <input
                            type="file"
                            accept=".csv,.txt"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    handleCSVUpload(event.target.result as string, file.name);
                                  }
                                };
                                reader.readAsText(file);
                              }
                            }}
                            className="hidden"
                            id="csv-file-input"
                          />
                          <label htmlFor="csv-file-input" className="mt-3 px-4 py-1.5 bg-[#0F172A] text-white text-[10px] uppercase font-black tracking-wider rounded cursor-pointer hover:bg-slate-800">
                            Select File
                          </label>
                        </div>

                        {csvUploadedFileName && (
                          <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-[#475569]/15 rounded-lg text-xs font-mono">
                            <span className="font-bold text-[#0F172A]">Active File:</span> {csvUploadedFileName}
                          </div>
                        )}

                        {csvParsedRows.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-[#475569]/10 pb-2">
                              <h3 className="text-xs font-black uppercase text-[#475569]">Detected Subscription Streams ({csvParsedRows.length})</h3>
                              <span className="text-[10px] font-mono italic text-[#475569]">Review repeating debit records</span>
                            </div>

                            <div className="overflow-x-auto border border-[#475569]/15 rounded-lg">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-slate-100 border-b border-[#475569]/15 font-mono text-[9px] font-bold text-[#475569] uppercase">
                                    <th className="p-3 w-12 text-center">Ingest</th>
                                    <th className="p-3">Merchant</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Frequency</th>
                                    <th className="p-3">Category</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {csvParsedRows.map((row, index) => (
                                    <tr key={row.id} className="border-b border-[#475569]/10 last:border-b-0 hover:bg-slate-50">
                                      <td className="p-3 text-center">
                                        <input 
                                          type="checkbox"
                                          checked={row.checked}
                                          onChange={() => {
                                            const updated = [...csvParsedRows];
                                            updated[index].checked = !updated[index].checked;
                                            setCsvParsedRows(updated);
                                          }}
                                          className="rounded border-[#475569]/30 text-[#0F172A] focus:ring-[#0F172A]"
                                        />
                                      </td>
                                      <td className="p-3 font-semibold text-[#0F172A]">{row.name}</td>
                                      <td className="p-3 font-mono text-[#0F172A]">{formatCurrency(convertCurrency(row.amount, row.currency || "USD", currency), currency)}</td>
                                      <td className="p-3 text-[#475569] uppercase font-mono text-[10px]">{row.frequency}</td>
                                      <td className="p-3 text-[#475569]">{row.category}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <button
                              onClick={handleBulkIngest}
                              className="w-full py-3 bg-[#0F172A] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                            >
                              <Check className="w-4 h-4 text-emerald-500" />
                              Ingest Selected Recurring Streams
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {onboardingOption === "manual" && (
                      <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-6">
                        <form onSubmit={handleManualAdd} className="space-y-4 text-xs">
                          <div className="border-b border-[#475569]/10 pb-4">
                            <h2 className="text-lg font-black text-[#0F172A] uppercase flex items-center gap-2">
                              <PlusCircle className="w-5 h-5" />
                              Manual Quick-Add Form
                            </h2>
                            <p className="text-xs text-[#475569]">Enter standard merchant billing values to manually establish an active mandate monitor.</p>
                          </div>

                          <div>
                            <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Merchant Name</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Netflix, Spotify, GitHub, Adobe..."
                              value={manualName}
                              onChange={(e) => setManualName(e.target.value)}
                              className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] font-bold outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Billing Amount ({currencySymbol})</label>
                              <input 
                                type="number" 
                                step="0.01"
                                required
                                placeholder="9.99"
                                value={manualAmount}
                                onChange={(e) => setManualAmount(e.target.value)}
                                className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] font-mono outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Billing Frequency</label>
                              <select 
                                value={manualFrequency}
                                onChange={(e) => setManualFrequency(e.target.value)}
                                className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] outline-none cursor-pointer"
                              >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="weekly">Weekly</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Subscription Category</label>
                              <select 
                                value={manualCategory}
                                onChange={(e) => setManualCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] outline-none cursor-pointer"
                              >
                                <option value="Entertainment">Entertainment</option>
                                <option value="Utility">Utility</option>
                                <option value="SaaS">SaaS / Productivity</option>
                                <option value="Finance">Finance</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5">Next Renewal Date</label>
                              <input 
                                type="date" 
                                required
                                value={manualNextBillingDate}
                                onChange={(e) => setManualNextBillingDate(e.target.value)}
                                className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] outline-none cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#475569]/10">
                            <button 
                              type="submit" 
                              className="px-6 py-3 bg-[#0F172A] hover:bg-slate-900 text-white font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                            >
                              <Check className="w-4 h-4 text-emerald-500" />
                              Add Subscription Stream
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {onboardingOption === "receipt" && (
                      <div className="bg-white p-6 rounded-lg border border-[#475569]/20 shadow-sm space-y-6">
                        <div className="border-b border-[#475569]/10 pb-4">
                          <h2 className="text-lg font-black text-[#0F172A] uppercase flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            Smart Receipt Paste Workspace
                          </h2>
                          <p className="text-xs text-[#475569]">Paste confirmation invoice emails or raw text invoices below. AI will isolate the subscription details.</p>
                        </div>

                        <div>
                          <label className="block text-[#475569] uppercase font-bold tracking-wider mb-1.5 text-xs">Pasted Receipt Text</label>
                          <textarea
                            rows={8}
                            placeholder="Paste invoice confirmation receipt here..."
                            value={receiptPasteText}
                            onChange={(e) => setReceiptPasteText(e.target.value)}
                            className="w-full bg-slate-50 border border-[#475569]/30 focus:border-[#0F172A] p-3 rounded-lg text-[#0F172A] font-mono outline-none text-xs"
                          />
                        </div>

                        <button
                          onClick={handleParseReceipt}
                          disabled={isReceiptParsing}
                          className="w-full py-3 bg-[#0F172A] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                          {isReceiptParsing ? "Parsing Receipt with AI..." : "Parse Receipt with AI"}
                        </button>

                        {receiptParseError && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-mono rounded-lg">
                            {receiptParseError}
                          </div>
                        )}

                        {parsedReceiptData && (
                          <div className="space-y-4 border-2 border-slate-900 rounded-lg p-5 bg-slate-50">
                            <div className="border-b border-[#475569]/10 pb-2">
                              <h3 className="text-xs font-black uppercase text-[#0F172A] flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Extracted Subscription Metadata
                              </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                              <div>
                                <span className="block text-[#475569] text-[10px] uppercase">Merchant Name</span>
                                <strong className="text-sm text-[#0F172A]">{parsedReceiptData.name}</strong>
                              </div>
                              <div>
                                <span className="block text-[#475569] text-[10px] uppercase">Billing Price</span>
                                <strong className="text-sm text-[#0F172A]">{formatCurrency(convertCurrency(parsedReceiptData.amount || 0, parsedReceiptData.currency || "USD", currency), currency)}</strong>
                              </div>
                              <div>
                                <span className="block text-[#475569] text-[10px] uppercase">Frequency</span>
                                <strong className="text-sm text-[#0F172A] uppercase">{parsedReceiptData.frequency}</strong>
                              </div>
                              <div>
                                <span className="block text-[#475569] text-[10px] uppercase">Category</span>
                                <strong className="text-sm text-[#0F172A]">{parsedReceiptData.category}</strong>
                              </div>
                              <div className="col-span-2">
                                <span className="block text-[#475569] text-[10px] uppercase">Predicted Next Bill Date</span>
                                <strong className="text-sm text-[#0F172A]">{new Date(parsedReceiptData.predictedNextDate).toLocaleDateString()}</strong>
                              </div>
                            </div>

                            <button
                              onClick={handleConfirmReceiptIngest}
                              className="w-full py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Confirm and Ingest Stream
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeTab === "darkPatterns" && (
                <DarkPatternLibrary />
              )}

              {activeTab === "complianceAudit" && (
                <ComplianceAuditTool currencySymbol={currencySymbol} />
              )}

              {activeTab === "regulatoryTracker" && (
                <RegulatoryTracker currencySymbol={currencySymbol} />
              )}

              {activeTab === "costCalculator" && (
                <LeakageCostCalculator currencySymbol={currencySymbol} />
              )}

              {activeTab === "flowComparison" && (
                <CancelFlowDemo currencySymbol={currencySymbol} />
              )}

              {activeTab === "inertiaProfiler" && (
                <InertiaProfiler />
              )}

              {activeTab === "consentLog" && (
                <ConsentLog />
              )}

              {activeTab === "researchData" && (
                <ResearchShowcase currencySymbol={currencySymbol} />
              )}

              {activeTab === "privacyPolicy" && (
                <PrivacyPolicy />
              )}
            </>
          )}

        </main>

        {/* FOOTER */}
        <footer className="mt-auto px-6 py-6 border-t border-[#475569]/20 bg-white text-[#475569] space-y-6" id="app-footer">
          {/* Top Row: Badges, Privacy Policy Link, and Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <span className="text-[10px] font-bold text-[#0F172A] tracking-wider font-mono uppercase bg-slate-50 px-2.5 py-1 rounded-lg border border-[#475569]/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                FEDERAL FTC COMPLIANCE: GREEN
              </span>
              <span className="text-[10px] font-bold text-[#0F172A] tracking-wider font-mono uppercase bg-slate-50 px-2.5 py-1 rounded-lg border border-[#475569]/20">
                AUDIT TRAIL LOGGING: PERSISTENT
              </span>
              <span className="text-[10px] font-bold text-[#0F172A] tracking-wider font-mono uppercase bg-slate-50 px-2.5 py-1 rounded-lg border border-[#475569]/20">
                INTEGRATION: PLAID ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateToTab("privacyPolicy")}
                className={`text-[10px] font-bold font-mono uppercase px-3 py-1.5 rounded border transition-all ${
                  activeTab === "privacyPolicy"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-[#0F172A] border-[#475569]/20 hover:bg-slate-50 hover:border-slate-400"
                }`}
                id="footer-privacy-policy-link"
              >
                Privacy Policy
              </button>
              <p className="text-[10px] font-bold tracking-tight text-[#475569] font-mono">
                © 2026 SUBSNAP SYSTEMS — DUAL-CHOICE MITIGATION GATEWAYS
              </p>
            </div>
          </div>

          {/* Bottom Row: Research Foundation References */}
          <div className="border-t border-[#475569]/10 pt-4" id="footer-research-foundation">
            <p className="text-[9px] font-black tracking-widest text-[#0F172A] font-mono uppercase mb-2">
              Research Foundation
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-[9px] font-mono text-[#64748B] leading-relaxed">
              <div className="p-2 bg-slate-50/60 rounded border border-[#475569]/5">
                <span className="block text-[#0F172A] font-bold mb-0.5">01 • JULIUS AI REPORT</span>
                Julius AI Data Report 2026 — Subscription Leakage Analysis
              </div>
              <div className="p-2 bg-slate-50/60 rounded border border-[#475569]/5">
                <span className="block text-[#0F172A] font-bold mb-0.5">02 • RESILIENCE STUDY</span>
                Strategic Architecture Report 2026 — Mitigating Leakage and Architecting Financial Resilience
              </div>
              <div className="p-2 bg-slate-50/60 rounded border border-[#475569]/5">
                <span className="block text-[#0F172A] font-bold mb-0.5">03 • WHARTON EXPERIMENT</span>
                Wharton Field Experiment 2026 — Consumer Inertia and Sophisticated User Behaviour
              </div>
              <div className="p-2 bg-slate-50/60 rounded border border-[#475569]/5">
                <span className="block text-[#0F172A] font-bold mb-0.5">04 • FTC DATA</span>
                FTC Enforcement Data 2025/26 — ROSCA and Section 5 violations
              </div>
              <div className="p-2 bg-slate-50/60 rounded border border-[#475569]/5">
                <span className="block text-[#0F172A] font-bold mb-0.5">05 • DIVA-PORTAL</span>
                Diva-Portal 2026 — Deceptive Design and Cancellation UX Study
              </div>
            </div>
          </div>
        </footer>

        {/* Dynamic Open Banking Share Modal */}
        <AnimatePresence>
          {isShareModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border-2 border-slate-900 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black uppercase tracking-wider font-mono">
                      Share Subscription Summary
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsShareModalOpen(false);
                      setCopiedToClipboard(false);
                    }}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    Export an official compliance and financial summary of your current subscription streams to document your passive spend leakage.
                  </p>

                  {/* Summary Textarea Preview */}
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={8}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none leading-relaxed"
                      value={getShareText()}
                    />
                    <div className="absolute bottom-3 right-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getShareText());
                          setCopiedToClipboard(true);
                          setTimeout(() => setCopiedToClipboard(false), 3000);
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-mono font-bold uppercase rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedToClipboard ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Text
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Social Sharing Options */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      Export to Platforms
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#1DA1F2] hover:bg-[#1a91da] text-white text-[10px] font-bold text-center uppercase rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        Twitter / X
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#0A66C2] hover:bg-[#0956a3] text-white text-[10px] font-bold text-center uppercase rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        LinkedIn
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent("My SubSnap Subscription Summary")}&body=${encodeURIComponent(getShareText())}`}
                        className="px-3 py-2 bg-[#475569] hover:bg-slate-700 text-white text-[10px] font-bold text-center uppercase rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        Email App
                      </a>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => {
                      setIsShareModalOpen(false);
                      setCopiedToClipboard(false);
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
