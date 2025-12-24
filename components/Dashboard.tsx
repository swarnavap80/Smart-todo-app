
import React, { useState, useEffect } from 'react';
import { Task, User, Priority } from '../types';
import { api } from '../services/apiService';
import { analyzeTask } from '../services/geminiService';
import TaskCard from './TaskCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, [user]);

  const loadTasks = async () => {
    const data = await api.getTasks(user.id);
    setTasks(data);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setAnalyzing(true);
    try {
      // 1. Get smart analysis from Gemini
      const analysis = await analyzeTask(title, description);
      
      // 2. Create task via API with AI analysis
      await api.createTask(user.id, {
        title,
        description,
        priority: analysis.priority,
        category: analysis.category,
        subtasks: analysis.subtasks
      });

      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await api.updateTask(task.id, { status: newStatus });
    loadTasks();
  };

  const deleteTask = async (id: string) => {
    await api.deleteTask(id);
    loadTasks();
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  // Analytics Data
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#EF4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#F59E0B' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10B981' },
  ].filter(d => d.value > 0);

  const statusData = [
    { name: 'Pending', count: tasks.filter(t => t.status !== 'completed').length },
    { name: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Workspace</h2>
          <p className="text-gray-500 mt-1">Authorized User: {user.name} ({user.email})</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            All
          </button>
          <button 
             onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'pending' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Active
          </button>
          <button 
             onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-all ${filter === 'completed' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Grid: Task Form and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Creation (Post Endpoint Simulator) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">POST /tasks</span>
              <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                API ACTIVE
              </span>
            </div>
            <form onSubmit={handleAddTask} className="p-6">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Task title (e.g., Learn React )"
                  className="w-full text-xl font-semibold border-none focus:ring-0 outline-none placeholder-gray-300"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea 
                  placeholder="Add description... "
                  className="w-full min-h-[80px] border-none focus:ring-0 outline-none text-gray-600 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex gap-4 text-gray-400 text-sm">
                   <span title="Smart Categorization Enabled"><i className="fas fa-magic text-indigo-400"></i> AI Smart</span>
                   <span title="JSON Schema Ready"><i className="fas fa-code"></i> REST</span>
                </div>
                <button 
                  type="submit" 
                  disabled={analyzing}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <i className="fas fa-brain fa-spin"></i>
                      
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      <span>Add Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Task List (Get Endpoint Simulator) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-list-ul text-indigo-500"></i>
              Task Feed
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                  <div className="text-gray-300 text-4xl mb-4"><i className="fas fa-inbox"></i></div>
                  <p className="text-gray-400">No tasks found. Create one to see the REST API in action.</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleStatus(task)} 
                    onDelete={() => deleteTask(task.id)} 
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center justify-between">
                Analytics
                <span className="text-indigo-500 font-mono text-[10px]">Real-time</span>
              </h3>
              
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-4">
                {priorityData.map(d => (
                  <div key={d.name} className="text-center">
                    <div className="text-xs font-bold text-gray-500">{d.name}</div>
                    <div className="text-lg font-black" style={{ color: d.color }}>{d.value}</div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Execution Status</h3>
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-indigo-900 text-indigo-100 p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">RESTful Philosophy</h4>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Every interaction here triggers a virtual HTTP request. Open the REST Debugger to inspect the JSON payloads and response structures.
                </p>
              </div>
              <i className="fas fa-network-wired absolute -right-4 -bottom-4 text-7xl text-indigo-800/50"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
