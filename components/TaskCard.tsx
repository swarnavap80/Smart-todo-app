
import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const priorityColors = {
    high: 'text-red-600 bg-red-50 border-red-100',
    medium: 'text-amber-600 bg-amber-50 border-amber-100',
    low: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  };

  const isCompleted = task.status === 'completed';

  return (
    <div className={`group bg-white rounded-xl p-5 border transition-all hover:shadow-md ${isCompleted ? 'border-green-200 bg-green-50/20' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:text-green-500'}`}
            title={isCompleted ? "Mark Pending" : "Mark Done"}
          >
            <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-check'}`}></i>
          </button>
          <button 
            onClick={onDelete}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete Resource"
          >
            <i className="fas fa-trash-alt text-xs"></i>
          </button>
        </div>
      </div>

      <h4 className={`font-bold text-gray-800 leading-snug mb-2 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
        {task.title}
      </h4>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {task.description || 'No description provided.'}
      </p>

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {task.subtasks.map((sub, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-400">
              <i className="fas fa-chevron-right text-[8px] text-indigo-300"></i>
              {sub}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
          <i className="fas fa-folder text-indigo-300"></i>
          {task.category}
        </div>
        <div className="text-[10px] text-gray-300 font-mono">
          ID: {task.id.split('-')[0]}...
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
