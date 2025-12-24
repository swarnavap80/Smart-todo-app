
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, ApiLog } from './types';
import { api } from './services/apiService';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ApiConsole from './components/ApiConsole';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  useEffect(() => {
    // Initial logs
    setLogs(api.getLogs());
    
    // Subscribe to new logs
    api.onLog((newLog) => {
      setLogs(prev => [newLog, ...prev]);
    });

    // Check session
    const savedUser = localStorage.getItem('session_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('session_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('session_user');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar user={user} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* Floating Toggle for API Console */}
          <button 
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all z-50 flex items-center gap-2"
          >
            <i className={`fas ${isConsoleOpen ? 'fa-times' : 'fa-terminal'}`}></i>
            <span className="hidden md:inline font-medium">REST Debugger</span>
          </button>

          <ApiConsole isOpen={isConsoleOpen} logs={logs} onClose={() => setIsConsoleOpen(false)} />
        </main>
      </div>
    </Router>
  );
};

export default App;
