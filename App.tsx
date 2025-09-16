import React, { useState, useEffect } from 'react';
import { useBikeState } from './hooks/useBikeState';
import Dashboard from './components/Dashboard';
import RefuelHistory from './components/RefuelHistory';
import Settings from './components/Settings';
import { GaugeIcon, HistoryIcon, SettingsIcon, FlameIcon } from './components/icons/Icons';

type View = 'dashboard' | 'history' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const bikeState = useBikeState();

  useEffect(() => {
    const setViewportHeight = () => {
      // We execute the inner function and multiply by 0.01 to get a value for a single vh unit
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setViewportHeight);
    setViewportHeight(); // Set the initial value

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);


  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard {...bikeState} />;
      case 'history':
        return <RefuelHistory 
          records={bikeState.refuelRecords} 
          onAddRecord={bikeState.addRefuelRecordWithNLP} 
          aiAnalysis={bikeState.aiAnalysis}
          onAnalyze={bikeState.analyzeFuelEconomy}
          loadingNlp={bikeState.loadingNlp}
          loadingAnalysis={bikeState.loadingAnalysis}
        />;
      case 'settings':
        return <Settings 
          settings={bikeState.settings} 
          onUpdate={bikeState.updateSettings}
        />;
      default:
        return <Dashboard {...bikeState} />;
    }
  };

  const NavItem: React.FC<{
    targetView: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ targetView, icon, label }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex flex-col items-center justify-center w-full py-2 px-1 text-xs sm:text-sm rounded-lg transition-all duration-300 ${
        view === targetView
          ? 'bg-cyan-500/20 text-cyan-400'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
      }`}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </button>
  );

  return (
    <div className="h-screen-dynamic bg-black text-gray-200 font-mono flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-lg h-full max-h-[850px] bg-gray-900/50 rounded-3xl border-4 border-gray-700/50 shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b-2 border-gray-700/50">
          <div className="flex items-center space-x-2">
            <FlameIcon className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-wider text-white">SmartBike</h1>
          </div>
          <div className="text-right">
             <div className={`text-xs px-2 py-1 rounded-full ${bikeState.isGpsAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {bikeState.isGpsAvailable ? 'GPS Online' : 'GPS Offline'}
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 overflow-y-auto">
          {renderView()}
        </main>

        <footer className="w-full bg-gray-800/50 border-t-2 border-gray-700/50 mt-auto">
          <nav className="flex justify-around items-center p-2">
            <NavItem targetView="dashboard" icon={<GaugeIcon />} label="Dashboard" />
            <NavItem targetView="history" icon={<HistoryIcon />} label="History" />
            <NavItem targetView="settings" icon={<SettingsIcon />} label="Settings" />
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default App;