import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  TrendingUp, 
  CreditCard, 
  Target, 
  ChevronRight, 
  Menu, 
  X,
  DollarSign,
  PieChart as PieChartIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import CompoundInterest from './components/CompoundInterest';
import LoanCalculator from './components/LoanCalculator';
import SavingsGoal from './components/SavingsGoal';
import GeminiInsight from './components/GeminiInsight';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'compound' | 'loan' | 'savings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('compound');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'compound', name: 'Compound Interest', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'loan', name: 'Loan Calculator', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'savings', name: 'Savings Goal', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'compound': return <CompoundInterest />;
      case 'loan': return <LoanCalculator />;
      case 'savings': return <SavingsGoal />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-bottom border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight">CashMaker</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-0 z-50 lg:relative lg:z-0 lg:flex lg:w-72 lg:flex-col bg-white border-r border-gray-200 transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight leading-none">CashMaker</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1">Kalkulator Pro</p>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  activeTab === tab.id 
                    ? cn(tab.bg, tab.color, "font-semibold shadow-sm") 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? tab.color : "text-gray-400 group-hover:text-gray-600")} />
                <span className="flex-1 text-left text-sm">{tab.name}</span>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            ))}
          </nav>

          <div className="p-6 mt-auto">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Market Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-600">Live Data Active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              <Calculator className="w-3 h-3" />
              <span>Financial Suite</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <GeminiInsight 
                context={activeTab} 
                data={{ type: activeTab, timestamp: new Date().toISOString() }} 
              />
              
              <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
                <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-gray-400" />
                  Quick Tips
                </h4>
                <ul className="space-y-3">
                  {[
                    "Start as early as possible to maximize compounding.",
                    "Aim to save at least 20% of your monthly income.",
                    "Review your loan terms annually for refinancing opportunities."
                  ].map((tip, i) => (
                    <li key={i} className="text-xs text-gray-500 flex gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
