import { useEffect, useState } from 'react';
import { Target, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ConfusionMatrixTab({ theme }) {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark' || theme === 'oled';

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/model-info`);
        const data = await res.json();
        setModelData(data);
      } catch (error) {
        console.error("Failed to fetch model details:", error);
      }
      setLoading(false);
    };
    fetchModelInfo();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;

  const metrics = modelData?.classification_report;
  
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 mb-8">
        <h2 className={`text-3xl lg:text-4xl font-extrabold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Target className="text-indigo-500" size={32} />
          Confusion Matrix & Metrics
        </h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-lg`}>
          Detailed mathematical breakdown of model's classification performance including Accuracy, Precision, Recall, and F1 Score.
        </p>
      </div>

      {metrics && (
        <div className={`p-8 rounded-3xl shadow-xl border mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
           <h3 className={`text-2xl font-bold flex items-center gap-2 mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
             <CheckCircle2 className="text-emerald-500" />
             Overall Classification Report
           </h3>
           <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <table className="w-full text-left border-collapse">
               <thead className={isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}>
                 <tr>
                   <th className="p-4 font-bold text-sm tracking-wider uppercase border-b border-r dark:border-slate-700 border-slate-200 w-1/4">Metric</th>
                   <th className="p-4 font-bold text-sm tracking-wider uppercase border-b dark:border-slate-700 border-slate-200">Score Percentage</th>
                 </tr>
               </thead>
               <tbody className="divide-y dark:divide-slate-700 divide-slate-100 text-base font-medium">
                 <tr className={`transition-colors ${isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-50 text-slate-800'}`}>
                   <td className="p-4 border-r dark:border-slate-700 border-slate-100">📌 Accuracy</td>
                   <td className="p-4 text-emerald-500 font-bold text-lg">{modelData.accuracy}%</td>
                 </tr>
                 <tr className={`transition-colors ${isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-50 text-slate-800'}`}>
                   <td className="p-4 border-r dark:border-slate-700 border-slate-100">🎯 Precision <span className="font-normal text-sm opacity-80">(Predicted True Rate)</span></td>
                   <td className="p-4 text-indigo-500 font-bold text-lg">{(metrics.precision * 100).toFixed(2)}%</td>
                 </tr>
                 <tr className={`transition-colors ${isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-50 text-slate-800'}`}>
                   <td className="p-4 border-r dark:border-slate-700 border-slate-100">🔍 Recall <span className="font-normal text-sm opacity-80">(Actual True Found Rate)</span></td>
                   <td className="p-4 text-amber-500 font-bold text-lg">{(metrics.recall * 100).toFixed(2)}%</td>
                 </tr>
                 <tr className={`transition-colors ${isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-50 text-slate-800'}`}>
                   <td className="p-4 border-r dark:border-slate-700 border-slate-100">⚖️ F1 Score <span className="font-normal text-sm opacity-80">(Harmonic Mean)</span></td>
                   <td className="p-4 text-purple-500 font-bold text-lg">{(metrics.f1_score * 100).toFixed(2)}%</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
      )}

      {modelData?.confusion_matrix && (
        <div className={`p-8 rounded-3xl shadow-xl border mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700 shadow-black/40' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
          <div className="flex items-center gap-3 mb-8">
            <FileText className="text-indigo-500" size={28} />
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Confusion Matrix Visualization
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-inner transition-transform hover:scale-[1.02] ${isDark ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-emerald-50 border-emerald-100'}`}>
               <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>True Negatives</span>
               <span className={`text-xs mt-1 ${isDark ? 'text-emerald-300/70' : 'text-emerald-600/70'}`}>Correctly predicted "No Attrition"</span>
               <span className={`text-5xl font-black mt-4 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{modelData.confusion_matrix.tn}</span>
            </div>
            
            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-inner transition-transform hover:scale-[1.02] ${isDark ? 'bg-amber-900/20 border-amber-800/50' : 'bg-amber-50 border-amber-100'}`}>
               <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>False Positives</span>
               <span className={`text-xs mt-1 ${isDark ? 'text-amber-300/70' : 'text-amber-600/70'}`}>Incorrectly predicted "Attrition"</span>
               <span className={`text-5xl font-black mt-4 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{modelData.confusion_matrix.fp}</span>
            </div>

            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-inner transition-transform hover:scale-[1.02] ${isDark ? 'bg-rose-900/20 border-rose-800/50' : 'bg-rose-50 border-rose-100'}`}>
               <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>False Negatives</span>
               <span className={`text-xs mt-1 ${isDark ? 'text-rose-300/70' : 'text-rose-600/70'}`}>Missed actual "Attrition"</span>
               <span className={`text-5xl font-black mt-4 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>{modelData.confusion_matrix.fn}</span>
            </div>

            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-inner transition-transform hover:scale-[1.02] ${isDark ? 'bg-indigo-900/20 border-indigo-800/50' : 'bg-indigo-50 border-indigo-100'}`}>
               <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>True Positives</span>
               <span className={`text-xs mt-1 ${isDark ? 'text-indigo-300/70' : 'text-indigo-600/70'}`}>Correctly predicted "Attrition"</span>
               <span className={`text-5xl font-black mt-4 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>{modelData.confusion_matrix.tp}</span>
            </div>
          </div>
          <p className={`text-center mt-6 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            This matrix breaks down the test predictions to show exactly where the model succeeds and where it makes errors.
          </p>
        </div>
      )}
    </div>
  );
}
