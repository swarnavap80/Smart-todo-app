
import React from 'react';
import { ApiLog } from '../types';

interface ApiConsoleProps {
  isOpen: boolean;
  logs: ApiLog[];
  onClose: () => void;
}

const ApiConsole: React.FC<ApiConsoleProps> = ({ isOpen, logs, onClose }) => {
  const methodColors = {
    GET: 'bg-blue-100 text-blue-600',
    POST: 'bg-green-100 text-green-600',
    PUT: 'bg-amber-100 text-amber-600',
    DELETE: 'bg-red-100 text-red-600',
  };

  const statusColors = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 400) return 'text-red-500';
    return 'text-gray-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 shadow-2xl z-[60] flex flex-col transform transition-transform border-l border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <i className="fas fa-terminal text-sm"></i>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">REST API Traffic</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-tighter">API_BASE_URL: https://mock-api.v1/tasks</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-center py-20 italic">
            Waiting for network activity...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden group">
              <div className="p-3 flex items-center justify-between bg-slate-800/80 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${methodColors[log.method]}`}>
                    {log.method}
                  </span>
                  <span className="text-slate-300 font-medium">{log.endpoint}</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`font-bold ${statusColors(log.status)}`}>{log.status}</span>
                   <span className="text-slate-600 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="p-3 space-y-3">
                {log.payload && (
                  <div>
                    <p className="text-slate-500 mb-1 text-[10px] uppercase font-bold tracking-widest">Request Body</p>
                    <pre className="p-2 bg-slate-900 rounded border border-slate-700 overflow-x-auto text-indigo-300">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                )}
                {log.response && (
                  <div>
                    <p className="text-slate-500 mb-1 text-[10px] uppercase font-bold tracking-widest">Response Body</p>
                    <pre className="p-2 bg-slate-900 rounded border border-slate-700 overflow-x-auto text-emerald-400">
                      {JSON.stringify(log.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 text-slate-500 text-[10px] flex justify-between">
        <span>Protocols: HTTP/1.1</span>
        <span>Content-Type: application/json</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Connected to Mock NoSQL
        </span>
      </div>
    </div>
  );
};

export default ApiConsole;
