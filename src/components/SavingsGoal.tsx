import { useState, useMemo } from 'react';
import { Target, ArrowRight, Wallet } from 'lucide-react';

export default function SavingsGoal() {
  const [target, setTarget] = useState(50000);
  const [current, setCurrent] = useState(5000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(5);

  const stats = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    // Formula for monthly contribution needed:
    // PMT = (FV - PV * (1 + r)^n) / (((1 + r)^n - 1) / r)
    const futureValueOfCurrent = current * Math.pow(1 + monthlyRate, months);
    const neededFromContributions = target - futureValueOfCurrent;
    
    let monthlyNeeded = 0;
    if (neededFromContributions > 0) {
      monthlyNeeded = neededFromContributions / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    return {
      monthlyNeeded: Math.max(0, Math.round(monthlyNeeded)),
      totalContributions: Math.max(0, Math.round(monthlyNeeded * months)),
      interestEarned: Math.max(0, Math.round(target - current - (monthlyNeeded * months)))
    };
  }, [target, current, years, rate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Goal Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Savings Target ($)</label>
              <input 
                type="number" 
                value={target} 
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Savings ($)</label>
              <input 
                type="number" 
                value={current} 
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years to Goal</label>
                <input 
                  type="number" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected ROI (%)</label>
                <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <p className="text-blue-800 text-sm font-medium uppercase tracking-wider mb-1">Monthly Savings Needed</p>
            <h2 className="text-4xl font-bold text-blue-900">${stats.monthlyNeeded.toLocaleString()}</h2>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Total Contributions</span>
              <span className="font-bold text-gray-900">${stats.totalContributions.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500" 
                style={{ width: `${(stats.totalContributions / target) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Interest Growth</span>
              <span className="font-bold text-emerald-600">${stats.interestEarned.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Start Saving Today</h4>
            <p className="text-sm text-gray-500">Consistency is the key to reaching your ${target.toLocaleString()} goal.</p>
          </div>
        </div>
        <ArrowRight className="w-6 h-6 text-gray-300" />
      </div>
    </div>
  );
}
