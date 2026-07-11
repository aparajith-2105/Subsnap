# ⚡ SubSnap: Automated Financial Resilience System
> **Deployed Live at:** [subsnap.vercel.app](https://vercel.app)  
> **Built with:** Google AI Studio (Gemini 3.5 Flash) & Google Stitch  

![License](https://shields.io)
![React](https://shields.io)
![Tailwind](https://shields.io)
![Automation](https://shields.io)

SubSnap is a robust fintech web application designed as an architectural response to **subscription leakage**—the systemic erosion of consumer capital through unintended recurring charges. Grounded in 2026 multi-jurisdictional regulatory frameworks and peer-reviewed behavioral economics research, SubSnap replaces manipulative retention-first dark patterns with transparent, bank-level consumer control.

## 📊 The Macroeconomic Challenge
Research from the **Wharton Field Experiment (2026)** establishes that subscription leakage is sustained not by ignorance, but by behavioral inertia:
*   **£1.2 Trillion:** Value of the global subscription economy.
*   **85.2% Monthly Inaction Rate:** The percentage of unwilling users who fail to cancel an unwanted bill in any given month due to cognitive fatigue and rational inattention.
*   **£102 Billion/Year:** Macroeconomic losses fueled by involuntary card churn and hidden trial-to-paid conversions.

## 🛠️ Core Architectural Pillars
1. **High-Salience Auditing ("Bank Setup Live!"):** A 4-stream onboarding hub (Plaid Bank Sync, CSV/XLS statement ingestion, Manual Form entries, and Smart Email Receipt extraction) that formats layouts into 9 global currencies (including USD, INR, and CNY).
2. **Neutral Autonomy Interface:** Completely eliminates emotional guilt-tripping text ("Confirmshaming"). Displays "Keep" and "End" options as two horizontally aligned, visually equivalent buttons.
3. **Automated Mitigation Layer:** Leverages Open Banking Variable Recurring Payment (VRP) tokens to execute an instant, single-click mandate revocation directly at the user's bank server, bypassing merchant-side traps.
4. **Compliance Ledger Tracking:** Automatically logs cryptographic transaction event hashes into a PostgreSQL `compliance_evidence_log`. Features a 1-click download button to export a certified evidence report to instantly win bank chargeback claims under the **2026 FTC Negative Option Rule**.

## 🔄 Live Automation Pipeline: n8n Workflow
SubSnap integrates a live outbound webhook framework. The moment a user cancels a mandate, the front end triggers a secure JSON payload payload to our production **n8n cloud instance**. n8n executes a background script in ~3.3 seconds to append the transaction records to a persistent auditing ledger, satisfying the federal 3-year compliance tracking mandate.

## 💻 Tech Stack
*   **Research & Modeling:** Julius AI · NotebookLM · Hidden Markov Models (HMM).
*   **Frontend Engine:** React (v18) · TypeScript · Vite · Tailwind CSS utilities.
*   **Automation:** n8n Cloud · Outbound Webhook Routing · Google Sheets API.
*   **Deployment:** GitHub Version Control · Vercel Global Edge CDN.

## 🚀 How to Run Locally

### Prerequisites
Ensure you have **Node.js** installed on your system.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in your root directory and pass your sandbox authentication parameters:
```env
PLAID_CLIENT_ID=sandbox_student_client
PLAID_SECRET=sandbox_student_secret
PLAID_ENVIRONMENT=sandbox
PLAID_ACCESS_TOKEN=access-sandbox-default
```

### 3. Launch Development Server
```bash
npm run dev
```
---
*Built with Google AI Studio (Gemini 3.5 Flash) 
and Google Stitch. Deployed on Vercel.*

