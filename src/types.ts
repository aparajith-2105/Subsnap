export type SubscriptionStatus = "active" | "keeping" | "cancelled" | "revoking" | "revoked";

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency?: string;
  frequency: "monthly" | "annual" | "weekly";
  predictedNextDate: string;
  category: string;
  anomalyFlag?: string;
  status: SubscriptionStatus;
  logoLetter: string;
  billingDetails: string;
  lastUsedDaysAgo: number;
  logoUrl?: string;
  isTrial?: boolean;
  nextTransitionAmount?: number;
  max_amount_per_charge?: number;
}

export interface SystemNotification {
  id: string;
  type: "upcoming_charge" | "new_detection" | "anomaly" | "vrp_revoked";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "high" | "medium" | "low";
  subId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: "SUCCESS" | "FAILED" | "PENDING" | "COMPLIANT";
}

export interface PlaidConfig {
  clientId: string;
  secret: string;
  environment: string;
  accessToken: string;
}
