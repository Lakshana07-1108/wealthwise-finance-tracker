<div align="center">

# 💰 WEALTHWISE – Personal Finance Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**A modern, AI-powered personal finance management application designed to help users track expenses, plan budgets, and build healthier financial habits.**

[🚀 Live Demo](https://wealthwise-final.vercel.app/) • [📖 Documentation](#-getting-started) • [🐛 Report Bug](https://github.com/Lakshana07-1108/wealthwise-finance-tracker/issues)

</div>

---

## 📸 Preview

<img width="1024" alt="WealthWise Dashboard Preview" src="https://github.com/user-attachments/assets/f79f14af-0f68-4fa3-b753-087d4ad0bab9" />

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    WEALTHWISE                                        │
│                           Personal Finance Tracker                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              🖥️  CLIENT LAYER                                        │
├─────────────────────┬─────────────────────┬─────────────────────┬───────────────────┤
│   React Components  │    Custom Hooks     │   React Context     │  React Hook Form  │
│   (ShadCN/UI)       │                     │   (State Mgmt)      │   + Zod           │
│   + Tailwind CSS    │   useAuth()         │                     │   (Validation)    │
│   + Recharts        │   useTransactions() │   AuthContext       │                   │
│   + Lucide Icons    │   useBudget()       │   ThemeContext      │   Form Handling   │
└─────────┬───────────┴──────────┬──────────┴──────────┬──────────┴─────────┬─────────┘
          │                      │                     │                    │
          └──────────────────────┴─────────┬───────────┴────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           ⚡ NEXT.JS 15 (APP ROUTER)                                 │
├───────────────────────────┬───────────────────────────┬─────────────────────────────┤
│       App Router          │        API Routes         │    Server Components        │
│                           │                           │                             │
│   /dashboard              │   /api/auth/*             │    Server-Side Rendering    │
│   /transactions           │   /api/transactions/*     │    Data Fetching            │
│   /budget                 │   /api/insights/*         │    SEO Optimization         │
│   /settings               │   /api/receipts/*         │                             │
└───────────────────────────┴─────────────┬─────────────┴─────────────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
┌───────────────────────────┐ ┌─────────────────────┐ ┌───────────────────────────────┐
│   🔐 FIREBASE AUTH        │ │  🗄️ CLOUD FIRESTORE │ │    📁 FIREBASE STORAGE        │
├───────────────────────────┤ ├─────────────────────┤ ├───────────────────────────────┤
│                           │ │                     │ │                               │
│  • Email/Password Auth    │ │  • Users Collection │ │  • Profile Pictures           │
│  • Session Management     │ │  • Transactions     │ │  • Receipt Images             │
│  • Secure Tokens          │ │  • Budgets          │ │  • Document Storage           │
│  • Password Reset         │ │  • Categories       │ │                               │
│                           │ │  • Real-time Sync   │ │                               │
└───────────────────────────┘ └─────────────────────┘ └───────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              🤖 AI / ML LAYER                                        │
├─────────────────────────────────────────┬───────────────────────────────────────────┤
│           Firebase Genkit               │            Google Gemini                  │
├─────────────────────────────────────────┼───────────────────────────────────────────┤
│                                         │                                           │
│  • AI Flow Orchestration                │  • Natural Language Processing            │
│  • Prompt Management                    │  • Spending Pattern Analysis              │
│  • Model Integration                    │  • Financial Recommendations              │
│  • Receipt Data Extraction              │  • Budget Optimization Suggestions        │
│                                         │                                           │
└─────────────────────────────────────────┴───────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                    │
└──────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  USER   │
    └────┬────┘
         │
         │ 1. Login/Signup
         ▼
┌─────────────────┐      2. Auth Request      ┌──────────────────┐
│                 │ ─────────────────────────▶│                  │
│   NEXT.JS APP   │                           │  FIREBASE AUTH   │
│                 │◀───────────────────────── │                  │
└────────┬────────┘      3. Auth Token        └──────────────────┘
         │
         │ 4. CRUD Operations
         ▼
┌─────────────────┐      5. Read/Write        ┌──────────────────┐
│                 │ ─────────────────────────▶│                  │
│   API ROUTES    │                           │ CLOUD FIRESTORE  │
│                 │◀───────────────────────── │                  │
└────────┬────────┘      6. Data Response     └──────────────────┘
         │
         │ 7. AI Analysis Request
         ▼
┌─────────────────┐      8. Process Data      ┌──────────────────┐
│                 │ ─────────────────────────▶│                  │
│  FIREBASE       │                           │  GOOGLE GEMINI   │
│  GENKIT         │◀───────────────────────── │  (LLM)           │
│                 │      9. AI Insights       │                  │
└────────┬────────┘                           └──────────────────┘
         │
         │ 10. Return Insights
         ▼
    ┌─────────┐
    │  USER   │  ◀── Smart Financial Recommendations
    └─────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            COMPONENT HIERARCHY                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication Routes
│   │   ├── login/                #   └── Login Page
│   │   └── signup/               #   └── Signup Page
│   ├── (dashboard)/              # Protected Dashboard Routes
│   │   ├── dashboard/            #   └── Main Dashboard
│   │   ├── transactions/         #   └── Transaction Management
│   │   ├── budget/               #   └── Budget Planning
│   │   └── settings/             #   └── User Settings
│   └── api/                      # API Routes
│       ├── auth/                 #   └── Authentication Endpoints
│       ├── transactions/         #   └── Transaction CRUD
│       └── insights/             #   └── AI Insights Endpoint
│
├── components/                   # Reusable UI Components
│   ├── ui/                       # ShadCN/UI Base Components
│   │   ├── button.tsx            #   └── Button Component
│   │   ├── card.tsx              #   └── Card Component
│   │   ├── dialog.tsx            #   └── Dialog/Modal Component
│   │   └── ...                   #   └── Other UI Components
│   ├── dashboard/                # Dashboard-Specific Components
│   │   ├── stats-cards.tsx       #   └── Statistics Cards
│   │   ├── expense-chart.tsx     #   └── Expense Visualization
│   │   └── recent-transactions/  #   └── Transaction List
│   └── forms/                    # Form Components
│       ├── transaction-form.tsx  #   └── Add/Edit Transaction
│       └── budget-form.tsx       #   └── Budget Configuration
│
├── hooks/                        # Custom React Hooks
│   ├── use-auth.ts               #   └── Authentication Hook
│   ├── use-transactions.ts       #   └── Transaction Data Hook
│   └── use-budget.ts             #   └── Budget Management Hook
│
├── lib/                          # Utilities & Configuration
│   ├── firebase.ts               #   └── Firebase Configuration
│   ├── utils.ts                  #   └── Helper Functions
│   └── validations.ts            #   └── Zod Schemas
│
└── ai/                           # AI Integration
    ├── genkit.ts                 #   └── Genkit Configuration
    ├── flows/                    #   └── AI Flows
    │   ├── insights-flow.ts      #       └── Financial Insights
    │   └── receipt-flow.ts       #       └── Receipt Processing
    └── prompts/                  #   └── AI Prompts
        └── financial-advisor.ts  #       └── Advisor Prompts
```

### Request Flow

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                         TRANSACTION CREATION FLOW                               │
└────────────────────────────────────────────────────────────────────────────────┘

  ┌────────┐    ┌────────────┐    ┌──────────┐    ┌───────────┐    ┌───────────┐
  │  User  │    │   Form     │    │  API     │    │ Firestore │    │ Dashboard │
  └───┬────┘    └─────┬──────┘    └────┬─────┘    └─────┬─────┘    └─────┬─────┘
      │               │                │                │                │
      │  Fill Form    │                │                │                │
      │──────────────▶│                │                │                │
      │               │                │                │                │
      │               │  Validate      │                │                │
      │               │  (Zod)         │                │                │
      │               │───────┐        │                │                │
      │               │       │        │                │                │
      │               │◀──────┘        │                │                │
      │               │                │                │                │
      │               │  POST Request  │                │                │
      │               │───────────────▶│                │                │
      │               │                │                │                │
      │               │                │  Add Document  │                │
      │               │                │───────────────▶│                │
      │               │                │                │                │
      │               │                │  Confirmation  │                │
      │               │                │◀───────────────│                │
      │               │                │                │                │
      │               │  Success       │                │                │
      │               │◀───────────────│                │                │
      │               │                │                │                │
      │  Toast        │                │                │  Refresh Data  │
      │◀──────────────│                │                │◀───────────────│
      │               │                │                │                │
      │               │                │                │  Updated View  │
      │◀─────────────────────────────────────────────────────────────────│
      │               │                │                │                │
  ┌───┴────┐    ┌─────┴──────┐    ┌────┴─────┐    ┌─────┴─────┐    ┌─────┴─────┐
  │  User  │    │   Form     │    │  API     │    │ Firestore │    │ Dashboard │
  └────────┘    └────────────┘    └──────────┘    └───────────┘    └───────────┘
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | User authentication powered by Firebase Authentication |
| 📊 **Smart Dashboard** | Interactive charts for visualizing income, expenses, and savings |
| 🧾 **Transaction Management** | Add, categorize, and review all your financial transactions |
| 🤖 **AI-Powered Insights** | Intelligent financial advice using Firebase Genkit & Google Gemini |
| 📷 **Receipt Scanning** | AI-ready automatic data extraction from receipts |
| 🎯 **Budget Planning** | Set and track budgets for different spending categories |
| 🖼️ **Profile Customization** | Upload profile pictures with Firebase Storage |
| 📱 **Responsive Design** | Beautiful, modern UI that works on all devices |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [ShadCN/UI](https://ui.shadcn.com/) | Accessible UI components |
| [Recharts](https://recharts.org/) | Data visualization library |
| [Lucide React](https://lucide.dev/) | Beautiful icons |

### Backend & Cloud
| Technology | Purpose |
|------------|---------|
| [Firebase Authentication](https://firebase.google.com/products/auth) | Secure user authentication |
| [Cloud Firestore](https://firebase.google.com/products/firestore) | NoSQL database |
| [Firebase Storage](https://firebase.google.com/products/storage) | File storage for profile pictures |
| [Firebase Genkit](https://firebase.google.com/products/genkit) | AI/ML integration |
| [Google Gemini](https://deepmind.google/technologies/gemini/) | Generative AI models |

### Form & State Management
| Technology | Purpose |
|------------|---------|
| [React Hook Form](https://react-hook-form.com/) | Performant form handling |
| [Zod](https://zod.dev/) | Schema validation |
| React Context API | Global state management |

---

## 📁 Project Structure

```
wealthwise-finance-tracker/
├── src/
│   ├── ai/              # AI/Genkit integration & prompts
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions & Firebase config
├── public/              # Static assets
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Firebase account** with a project set up

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lakshana07-1108/wealthwise-finance-tracker.git
   cd wealthwise-finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:9002](http://localhost:9002) in your browser.

5. **Run Genkit AI (optional)**
   ```bash
   npm run genkit:dev
   ```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run genkit:dev` | Start Genkit AI development server |
| `npm run genkit:watch` | Start Genkit with file watching |

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Fork this repository
2. Connect your fork to Vercel
3. Add the required environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lakshana07-1108/wealthwise-finance-tracker)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Lakshana07-1108**

- GitHub: [@Lakshana07-1108](https://github.com/Lakshana07-1108)

---

<div align="center">

⭐ **If you found this project helpful, please consider giving it a star!** ⭐

</div>
