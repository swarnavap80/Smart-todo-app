
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <aside className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col h-full transition-all">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
          <i className="fas fa-code"></i>
        </div>
        <div className="hidden md:block">
          <h1 className="font-black text-gray-900 tracking-tight leading-none">SmartToDo</h1>
          <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">REST System v1.0</span>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        <a href="#" className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold transition-all">
          <i className="fas fa-th-large w-5 text-center"></i>
          <span className="hidden md:inline">Console</span>
        </a>
        <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-xl font-medium transition-all group">
          <i className="fas fa-users w-5 text-center group-hover:scale-110 transition-transform"></i>
          <span className="hidden md:inline">Team</span>
        </a>
        <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-xl font-medium transition-all group">
          <i className="fas fa-chart-line w-5 text-center group-hover:scale-110 transition-transform"></i>
          <span className="hidden md:inline">Analytics</span>
        </a>
        <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-xl font-medium transition-all group">
          <i className="fas fa-cog w-5 text-center group-hover:scale-110 transition-transform"></i>
          <span className="hidden md:inline">API Config</span>
        </a>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 hidden md:block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">Developer Tier</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-2 text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            Revoke Access
          </button>
        </div>
        <button 
          onClick={onLogout}
          className="md:hidden w-full flex items-center justify-center p-3 text-red-500 hover:bg-red-50 rounded-xl"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
