import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import { Loader2, GitMerge } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function TreeVisualizer({ theme }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark' || theme === 'oled';

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tree-data`);
        const data = await res.json();
        setTreeData(data);
      } catch (error) {
        console.error("Failed to fetch tree data:", error);
      }
      setLoading(false);
    };
    fetchTreeData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;

  if (!treeData || treeData.error || treeData.length === 0) {
    return (
      <div className={`flex justify-center items-center h-64 font-medium rounded-2xl border ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
        Error loading tree logic. Check backend connection.
      </div>
    );
  }

  const colors = {
    bg: isDark ? '#1e293b' : '#f8fafc',
    stroke: isDark ? '#475569' : '#cbd5e1',
    textMain: isDark ? '#f1f5f9' : '#0f172a',
    textSub: isDark ? '#94a3b8' : '#64748b',
    yesBg: isDark ? '#450a0a' : '#fef2f2',
    yesStroke: isDark ? '#ef4444' : '#f87171',
    noBg: isDark ? '#052e16' : '#f0fdf4',
    noStroke: isDark ? '#22c55e' : '#4ade80',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="space-y-2">
        <h2 className={`text-3xl lg:text-4xl font-extrabold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <GitMerge className="text-indigo-500" size={32} />
          Decision Tree Architecture
        </h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-lg`}>
          An interactive map of the algorithm's decision-making process. Zoom, drag, and click nodes to explore the logical splits.
        </p>
      </div>

      <div className={`rounded-3xl border overflow-hidden shadow-xl h-[700px] w-full relative transition-colors duration-500 ${isDark ? 'bg-slate-900/50 border-slate-700 shadow-black/50' : 'bg-slate-50 border-slate-200 shadow-slate-200/50'}`}>
        <Tree 
          data={treeData} 
          orientation="vertical"
          pathFunc="step"
          translate={{ x: window.innerWidth / 2.5, y: 50 }}
          zoomable={true}
          collapsible={true}
          nodeSize={{ x: 220, y: 120 }}
          pathProps={{
            stroke: isDark ? '#475569' : '#94a3b8',
            strokeWidth: 2,
          }}
          renderCustomNodeElement={(rd3tProps) => {
            const nodeName = rd3tProps.nodeDatum.name || "N/A";
            const isLeafNode = !rd3tProps.nodeDatum.children;
            const isAttritionYes = nodeName.includes("Yes");
            
            let nodeBg = colors.bg;
            let nodeStroke = colors.stroke;
            
            if (isLeafNode) {
              nodeBg = isAttritionYes ? colors.yesBg : colors.noBg;
              nodeStroke = isAttritionYes ? colors.yesStroke : colors.noStroke;
            }

            return (
              <g className="cursor-pointer transition-all hover:scale-105">
                <rect 
                  width="200" 
                  height="70" 
                  x="-100" 
                  y="-35" 
                  fill={nodeBg}
                  stroke={nodeStroke}
                  strokeWidth="2.5"
                  rx="12"
                  className="shadow-lg drop-shadow-md"
                />
                <text fill={colors.textMain} strokeWidth="0" x="0" y="-8" textAnchor="middle" className="text-sm font-bold tracking-wide">
                  {nodeName}
                </text>
                {rd3tProps.nodeDatum.attributes && (
                  <text fill={colors.textSub} strokeWidth="0" x="0" y="15" textAnchor="middle" className="text-xs font-medium">
                    Samples Evaluated: {rd3tProps.nodeDatum.attributes.Samples}
                  </text>
                )}
              </g>
            );
          }}
        />
      </div>
    </div>
  );
}