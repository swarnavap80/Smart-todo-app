
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: string;
  dueDate: string;
  subtasks: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  payload?: any;
  response?: any;
  timestamp: string;
}

export interface SmartTaskAnalysis {
  category: string;
  priority: Priority;
  subtasks: string[];
  estimatedMinutes: number;
}
