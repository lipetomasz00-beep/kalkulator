import { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Calculator, TrendingUp, Info } from 'lucide-react';

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [contribution, setContribution] = useState(500);
  const [frequency, setFrequency] = useState(12); // Monthly

  const data = useMemo(() => {
    const results = [];
    let balance = principal;
    const monthlyRate = rate / 100 / 12;

    for (let i = 0; i <= years; i++) {
      results.push({
        year: i,
        balance: Math.round(balance),
        contributions: principal + (contribution * frequency * i)
      });

      // Calculate next year's balance
      for (let j = 0; j < 12; j++) {
        balance = (balance + contribution) * (1 + monthlyRate);
      }
    }
    return results;
  }, [principal, rate, years, contribution, frequency]);

  const finalBalance = data[data.length - 1].balance;
  const totalContributions = data[data.length - 1].contributions;
  const totalInterest = finalBalance - totalContributions;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Investment ($)</label>
              <input 
                type="number" 
                value={principal} 
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Interest Rate (%)</label>
              <input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution ($)</label>
              <input 
                type="number" 
                value={contribution} 
                onChange={(e) => setContribution(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (Years)</label>
              <input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <p className="text-emerald-800 text-sm font-medium uppercase tracking-wider mb-1">Final Balance</p>
            <h2 className="text-4xl font-bold text-emerald-900">${finalBalance.toLocaleString()}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Contributions</p>
              <p className="text-xl font-bold text-gray-900">${totalContributions.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Interest</p>
              <p className="text-xl font-bold text-emerald-600">${totalInterest.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <p className="text-sm text-gray-600 italic">
              In {years} years, your money will have grown by {( (finalBalance/totalContributions - 1) * 100 ).toFixed(1)}% through the power of compounding.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 h-[400px]">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Growth Projection
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 12, fill: '#9ca3af'}}
              tickFormatter={(val) => `$${val/1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
            <Area 
              type="monotone" 
              dataKey="contributions" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
