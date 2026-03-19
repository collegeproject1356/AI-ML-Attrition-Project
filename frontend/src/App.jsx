import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';
import ModelDetails from './components/ModelDetails';
import DataViewer from './components/DataViewer';
import TreeVisualizer from './components/TreeVisualizer';

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [theme, setTheme] = useState('oled'); // 'light', 'dark', 'oled'

  // Theme Management Logic
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'oled');
    root.classList.add(theme);
    if (theme === 'oled') root.classList.add('dark'); // OLED uses dark text colors
  }, [theme]);

  // Theme background classes
  const getBgClass = () => {
    if (theme === 'oled') return 'bg-black text-slate-200';
    if (theme === 'dark') return 'bg-slate-900 text-slate-200';
    return 'bg-slate-50 text-slate-800';
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 flex flex-col ${getBgClass()}`}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="animate-in fade-in zoom-in-95 duration-500">
          {activeTab === 'predict' && <PredictionForm theme={theme} />}
          {activeTab === 'data' && <DataViewer theme={theme} />}
          {activeTab === 'model' && <ModelDetails theme={theme} />}
          {activeTab === 'tree' && <TreeVisualizer theme={theme} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-slate-200 dark:border-slate-800 opacity-80 transition-colors">
        <p className="text-sm font-medium">
          © {new Date().getFullYear()} <span className="text-indigo-500">Grp17 AI</span>. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}