import { useState } from 'react';
import { ChevronRight, Loader2, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
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
          <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all animate-in zoom-in-95 duration-300 shadow-lg ${
            result.prediction === 'Yes' 
              ? (isDark ? 'bg-red-500/10 border-red-500/20 shadow-red-500/10' : 'bg-red-50 border-red-200 shadow-red-100') 
              : (isDark ? 'bg-green-500/10 border-green-500/20 shadow-green-500/10' : 'bg-green-50 border-green-200 shadow-green-100')
          }`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Prediction Result</h3>
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
          </div>
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