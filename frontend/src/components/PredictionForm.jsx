import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2, ShieldAlert, ShieldCheck, Zap, Lightbulb } from 'lucide-react';
import { API_BASE_URL } from '../config'; 

export default function PredictionForm({ theme }) {
  const [formData, setFormData] = useState({
    Age: '', MonthlyIncome: '', TotalWorkingYears: '', YearsAtCompany: '', DistanceFromHome: '', OverTime: 'No'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark' || theme === 'oled';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) { console.error("Prediction Error:", error); }
    setLoading(false);
  };

  const getActionableInsights = () => {
    if (!result || result.prediction === 'No') return null;
    const insights = [];
    if (formData.OverTime === 'Yes') insights.push("Employee is working Overtime. Consider redistributing workload to prevent burnout.");
    if (Number(formData.MonthlyIncome) < 5000) insights.push("Monthly income is relatively low. Review compensation against market averages focusing on retention.");
    if (Number(formData.DistanceFromHome) > 15) insights.push("Commute distance is high. Explore hybrid/remote work options or travel allowances.");
    if (Number(formData.YearsAtCompany) > 4 && Number(formData.MonthlyIncome) < 6000) insights.push("Tenured employee might feel undercompensated. Schedule a performance review.");
    if (insights.length === 0) insights.push("Monitor engagement and schedule a preemptive 1-on-1 check-in to discuss career goals.");
    return insights;
  };

  const insights = getActionableInsights();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start pt-4 animate-in fade-in duration-500">
      
      <div className="space-y-8 lg:sticky lg:top-28">
        <div>
          <h1 className={`text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Predict Employee <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Attrition</span>
          </h1>
          <p className={`text-lg leading-relaxed transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Enter the 6 key employee metrics to predict the likelihood of them leaving the company. 
            Our focused AI model guarantees fast and sensible results.
          </p>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className={`p-6 rounded-2xl border backdrop-blur-sm shadow-lg ${
            result.prediction === 'Yes' 
              ? (isDark ? 'bg-red-500/10 border-red-500/20 shadow-red-500/10' : 'bg-red-50 border-red-200 shadow-red-100') 
              : (isDark ? 'bg-green-500/10 border-green-500/20 shadow-green-500/10' : 'bg-green-50 border-green-200 shadow-green-100')
          }`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Prediction Result</h3>
            </div>
            
            <div className="flex items-end gap-4">
              <span className={`text-4xl font-black flex items-center gap-2 ${result.prediction === 'Yes' ? 'text-red-500' : 'text-green-500'}`}>
                {result.prediction === 'Yes' ? <ShieldAlert size={36}/> : <ShieldCheck size={36}/>}
                {result.prediction === 'Yes' ? 'High Risk' : 'Safe to Retain'}
              </span>
              <span className={`mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Probability: {result.probability}%</span>
            </div>
            <div className={`w-full rounded-full h-3 mt-5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className={`h-full transition-all duration-1000 ease-out ${result.prediction === 'Yes' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-400'}`} style={{ width: `${result.probability}%` }}></div>
            </div>

            {result.prediction === 'Yes' && insights && insights.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 pt-6 border-t border-red-500/20">
                <h4 className={`text-sm font-bold flex items-center gap-2 mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  <Lightbulb size={18} /> Actionable HR Insights
                </h4>
                <ul className="space-y-2">
                  {insights.map((insight, idx) => (
                    <li key={idx} className={`text-sm flex items-start ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="mr-2 mt-1">•</span> {insight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        )}

        {!result && (
          <div className={`hidden lg:flex p-6 rounded-2xl border items-start gap-4 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="bg-indigo-500 p-2 rounded-lg text-white mt-1"><Zap size={20}/></div>
            <div>
              <h4 className={`font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>AI Processing Ready</h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Waiting for input parameters. The algorithm processes historical HR data across 6 dimensions instantly to calculate flight risk.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={`p-8 rounded-3xl shadow-xl border transition-all duration-300 ${isDark ? 'bg-slate-800/40 border-slate-700 shadow-black/50' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Age *</label>
              <input type="number" name="Age" required min="18" max="100" value={formData.Age} onChange={handleChange} placeholder="e.g. 30" 
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${isDark ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Monthly Income ($) *</label>
              <input type="number" name="MonthlyIncome" required min="0" value={formData.MonthlyIncome} onChange={handleChange} placeholder="e.g. 5000" 
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${isDark ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total Working Years *</label>
              <input type="number" name="TotalWorkingYears" required min="0" max="50" value={formData.TotalWorkingYears} onChange={handleChange} placeholder="e.g. 8" 
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${isDark ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Years at Company *</label>
              <input type="number" name="YearsAtCompany" required min="0" max="50" value={formData.YearsAtCompany} onChange={handleChange} placeholder="e.g. 3" 
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${isDark ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Distance from Home (km) *</label>
              <input type="number" name="DistanceFromHome" required min="0" value={formData.DistanceFromHome} onChange={handleChange} placeholder="e.g. 10" 
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${isDark ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Does Overtime? *</label>
              <select name="OverTime" value={formData.OverTime} onChange={handleChange} 
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 transition-all outline-none cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                <option value="Yes" className={isDark ? 'bg-slate-800 text-white' : ''}>Yes</option>
                <option value="No" className={isDark ? 'bg-slate-800 text-white' : ''}>No</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:transform-none">
              {loading ? <Loader2 className="animate-spin" /> : 'Run AI Prediction'}
              {!loading && <ChevronRight size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}