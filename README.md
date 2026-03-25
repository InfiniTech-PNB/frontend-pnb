# 🛡️ KavachAI Frontend – Quantum-Safe Infrastructure Dashboard

This frontend application provides a powerful and interactive dashboard for visualizing cryptographic vulnerabilities and managing the transition to **Post-Quantum Cryptography (PQC)**.

It enables security administrators to monitor infrastructure **Quantum Readiness**, perform scans, analyze risks, and follow AI-generated remediation strategies.

---

## 🚀 Features

- **Infrastructure Mapping**: Discover domains, subdomains, IPs, and services interactively.
- **PQC Risk Scoring**: ML-based scoring with CIA (Confidentiality, Integrity, Availability) metrics.
- **Cryptographic Inventory (CBOM)**: Detailed TLS versions, cipher suites, and PQC algorithms.
- **AI-Powered Roadmaps**: Migration guidance with recommendations (ML-KEM, CRYSTALS-Dilithium).
- **Interactive AI Chatbot**: Query scan results and compliance insights.
- **Secure Authentication Flow**: JWT + OTP-based login integration.
- **Data Visualization**: Risk distribution and trends using charts.

---

## 🔄 Execution Flow / How it Works

1. **Authenticate**  
   User logs in with email and OTP verification (2FA).

2. **Discover**  
   User inputs a domain → system maps assets (subdomains, IPs, services).

3. **Configure**  
   User sets business context (criticality, SLA).

4. **Audit**  
   Run:
   - Soft Scan  
   - Deep Scan  

5. **Analyze**  
   - View PQC readiness score  
   - Inspect cryptographic inventory  
   - Download CBOM report  

6. **Remediate**  
   Follow AI-generated recommendations for upgrading infrastructure.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
- **Icons**: Lucide React

### Styling & UI
- **CSS Framework**: Tailwind CSS
- **Animations**: Framer Motion / Tailwind Animate
- **Design System**: Custom Industrial / Cyberpunk UI

### API & Data Handling
- **HTTP Client**: Axios (with JWT interceptors)
- **Visualization**: Chart.js / Recharts

---

## 📂 Project Structure

```text
frontend-pnb/
├── public/              # Static assets and branding
├── src/
│   ├── assets/          # Images and global styles
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Layout wrappers (Auth, Dashboard)
│   ├── pages/           # Views (Scan, History, Results, Chat)
│   ├── services/        # API configuration (Axios)
│   ├── utils/           # Helpers (CIA scoring, formatters)
│   └── App.jsx          # Root component & protected routes
├── tailwind.config.js   # Theme configuration
└── package.json         # Dependencies

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- Running backend server

### Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend-pnb

2. Install dependencies:
   ```bash
   npm install

3. Configure environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api

4. Start Development Server:
   ```bash
   npm run dev

---

## 📊 Application Modules

### Authentication
- Login with email & password  
- OTP verification (2FA)  
- JWT-based session handling  

### Discovery
- Input domain  
- Asset mapping (subdomains, IPs, services)  

### Audit Center
- Run Soft / Deep scans  
- Monitor scan progress  

### Results View
- TLS/SSL configuration details  
- Cipher suite analysis  
- PQC readiness insights  

### CBOM Reports
- Generate cryptographic inventory  
- Download PDF reports  

### History Portal
- View past scans  
- Analyze trends over time  

### AI Chatbot
- Ask questions about scans  
- Get compliance and security insights  

---

## 👤 Team Information

- **Author**: InfiniTech 🚀