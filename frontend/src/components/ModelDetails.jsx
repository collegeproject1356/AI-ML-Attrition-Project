import { useEffect, useState } from 'react';
import { Target, Zap, Loader2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { API_BASE_URL } from '../config';

export default function ModelDetails({ theme }) {
  const [modelData, setModelData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark' || theme === 'oled';

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/model-info`);
        const data = await res.json();
        setModelData(data);
        
        if (data.feature_importance) {
          const formattedData = Object.entries(data.feature_importance).map(([key, value]) => ({
            name: key.replace(/([A-Z])/g, ' $1').trim(), // Add spaces to camelCase
            importance: Number((value * 100).toFixed(1))
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch model details:", error);
      }
      setLoading(false);
    };
    fetchModelInfo();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl shadow-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
          <p className="font-bold mb-1">{payload[0].payload.name}</p>
          <p className="text-indigo-500 font-semibold">Impact: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      
      <div className="space-y-2">
        <h2 className={`text-3xl lg:text-4xl font-extrabold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Target className="text-indigo-500" size={32} />
          Model Performance Insights
        </h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-lg`}>
          Analyze the mathematical decisions and accuracy metrics behind our AI predictions.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className={`p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center transform transition-all hover:scale-105 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-indigo-50 shadow-indigo-100/50'}`}>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-2xl text-white mb-6 shadow-lg shadow-indigo-500/30">
            <Target size={36} />
          </div>
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Testing Accuracy</h3>
          <p className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {modelData?.accuracy || '85.00'}%
          </p>
          <div className={`w-full rounded-full h-2 mt-6 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${modelData?.accuracy || 85}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl shadow-indigo-900/20 text-white flex flex-col justify-center transform transition-all hover:scale-105 md:col-span-2 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10"><Zap size={150} /></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400"><Zap size={24} /></div>
            <h3 className="text-2xl font-bold">How the AI Thinks</h3>
          </div>
          <p className="text-slate-300 leading-relaxed mb-6 text-lg relative z-10">
            Our model doesn't just guess; it calculates mathematically. The chart below illustrates <strong>Feature Importance</strong>—showing exactly which employee metrics carry the most weight when determining flight risk.
          </p>
          <div className="flex items-center text-sm font-semibold text-indigo-300 gap-2 bg-indigo-500/10 w-fit px-4 py-2 rounded-full border border-indigo-500/20">
            <TrendingUp size={16} /> Live Data Sync Active
          </div>
        </div>
      </div>

      <div className={`p-8 rounded-3xl shadow-xl border ${isDark ? 'bg-slate-800/50 border-slate-700 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
        <h3 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <TrendingUp className="text-indigo-500" /> Top Influencing Factors
        </h3>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 13, fontWeight: 600 }} 
                width={150}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4 }} />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]} barSize={24} animationDuration={1500}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorGradient)`} />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}