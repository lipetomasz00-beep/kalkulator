import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CreditCard, Calendar, Percent } from 'lucide-react';

export default function LoanCalculator() {
  const [amount, setAmount] = useState(300000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(30);

  const stats = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - amount;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principalPercent: Math.round((amount / totalPayment) * 100),
      interestPercent: Math.round((totalInterest / totalPayment) * 100)
    };
  }, [amount, rate, years]);

  const chartData = [
    { name: 'Principal', value: amount, color: '#10b981' },
    { name: 'Interest', value: stats.totalInterest, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-rose-600" />
            Loan Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount ($)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Years)</label>
              <input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <p className="text-rose-800 text-sm font-medium uppercase tracking-wider mb-1">Monthly Payment</p>
            <h2 className="text-4xl font-bold text-rose-900">${stats.monthlyPayment.toLocaleString()}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Interest</p>
              <p className="text-xl font-bold text-rose-600">${stats.totalInterest.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Cost</p>
              <p className="text-xl font-bold text-gray-900">${stats.totalPayment.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: number) => `$${val.toLocaleString()}`}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Interest makes up <span className="font-bold text-rose-600">{stats.interestPercent}%</span> of your total loan cost.
        </div>
      </div>
    </div>
  );
}
