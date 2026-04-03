import { Activity, Database, GitMerge, LayoutDashboard, Menu, X, Settings, Moon, Sun, Monitor, Grid } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { id: 'predict', label: 'Predict', icon: <Activity size={18} /> },
    { id: 'data', label: 'Dataset', icon: <Database size={18} /> },
    { id: 'model', label: 'Model Info', icon: <LayoutDashboard size={18} /> },
    { id: 'confusion_matrix', label: 'Confusion Matrix', icon: <Grid size={18} /> },
    { id: 'tree', label: 'Tree Vis', icon: <GitMerge size={18} /> },
  ];

  const isDark = theme === 'dark' || theme === 'oled';

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 border-b backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} ${theme === 'oled' && 'bg-black/80'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('predict')}>
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Grp17 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <div className={`flex space-x-1 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100/50 border-slate-200'}`}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : `${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div className="relative ml-4">
              <button onClick={() => setShowSettings(!showSettings)} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                <Settings size={20} className={showSettings ? "animate-spin-slow" : ""} />
              </button>

              {showSettings && (
                <div className={`absolute right-0 mt-3 w-40 rounded-2xl shadow-xl border overflow-hidden animate-in slide-in-from-top-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <button onClick={() => {setTheme('light'); setShowSettings(false)}} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${theme === 'light' ? 'text-indigo-500 bg-indigo-50/10' : (isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50')}`}><Sun size={16}/> Light</button>
                  <button onClick={() => {setTheme('dark'); setShowSettings(false)}} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${theme === 'dark' ? 'text-indigo-500 bg-indigo-50/10' : (isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50')}`}><Moon size={16}/> Dark</button>
                  <button onClick={() => {setTheme('oled'); setShowSettings(false)}} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${theme === 'oled' ? 'text-indigo-500 bg-indigo-50/10' : (isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50')}`}><Monitor size={16}/> OLED Black</button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button className={`p-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className={`md:hidden py-4 border-t animate-in slide-in-from-top-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="mb-4">
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Menu</p>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left font-medium rounded-xl mb-1 ${
                    activeTab === item.id ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100')
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
            
            <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
               <p className={`text-xs font-bold uppercase tracking-wider mb-2 px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Theme</p>
               <div className="flex gap-2 px-2">
                 <button onClick={() => {setTheme('light'); setIsOpen(false)}} className={`flex-1 flex justify-center py-2 rounded-lg border ${theme === 'light' ? 'border-indigo-500 text-indigo-500 bg-indigo-50/10' : (isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600')}`}><Sun size={20}/></button>
                 <button onClick={() => {setTheme('dark'); setIsOpen(false)}} className={`flex-1 flex justify-center py-2 rounded-lg border ${theme === 'dark' ? 'border-indigo-500 text-indigo-500 bg-indigo-50/10' : (isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600')}`}><Moon size={20}/></button>
                 <button onClick={() => {setTheme('oled'); setIsOpen(false)}} className={`flex-1 flex justify-center py-2 rounded-lg border ${theme === 'oled' ? 'border-indigo-500 text-indigo-500 bg-indigo-50/10' : (isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600')}`}><Monitor size={20}/></button>
               </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}