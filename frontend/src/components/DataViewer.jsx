import { useEffect, useState } from 'react';
import { Database, Loader2, Download, Users, Briefcase, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function DataViewer({ theme }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/sample-data`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const isDark = theme === 'dark' || theme === 'oled';

  const totalEmployees = data.length;
  const attritionCount = data.filter(d => d.Attrition === 'Yes').length;
  const attritionRate = totalEmployees > 0 ? ((attritionCount / totalEmployees) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <h2 className={`text-3xl lg:text-4xl font-extrabold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Database className="text-indigo-500" size={32} />
            Dataset Explorer
          </h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} max-w-2xl text-lg`}>
            Explore the raw structured data used by Grp17 AI to train the prediction models. Filter and analyze patterns directly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Records", value: totalEmployees, icon: <Users size={24}/>, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Attrition Rate", value: `${attritionRate}%`, icon: <TrendingUp size={24}/>, color: "text-red-500", bg: "bg-red-500/10" },
          { title: "Features Analyzed", value: headers.length, icon: <Briefcase size={24}/>, color: "text-purple-500", bg: "bg-purple-500/10" }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl flex items-center gap-5 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.title}</p>
              <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border overflow-hidden shadow-xl ${isDark ? 'border-slate-700 shadow-black/50' : 'border-slate-200 shadow-slate-200/50'}`}>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] styled-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className={`sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-slate-800/90 text-slate-300' : 'bg-slate-100/90 text-slate-600'}`}>
              <tr>
                <th className="p-4 border-b border-r border-slate-700/20 text-center font-black w-12 text-xs">#</th>
                {headers.map((header) => (
                  <th key={header} className={`p-4 border-b border-r border-slate-700/20 text-xs font-bold uppercase tracking-wider`}>
                    {header.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/10 text-sm">
              {data.map((row, index) => (
                <tr key={index} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/50 text-slate-300' : 'hover:bg-indigo-50/50 bg-white text-slate-700'}`}>
                  <td className={`p-3 text-center border-r border-slate-700/10 font-medium text-xs ${isDark ? 'bg-slate-900/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                    {index + 1}
                  </td>
                  {headers.map((header) => (
                    <td key={header} className={`p-3 border-r border-slate-700/10 group-hover:border-indigo-500/20`}>
                      {header === 'Attrition' ? (
                        <span className={`px-3 py-1 rounded-md text-xs font-black tracking-wide ${row[header] === 'Yes' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                          {row[header]}
                        </span>
                      ) : (
                        row[header]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}