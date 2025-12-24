
import { Task, User, ApiLog } from '../types';
import { v4 as uuidv4 } from 'uuid';

class ApiService {
  private logs: ApiLog[] = [];
  private onLogListeners: ((log: ApiLog) => void)[] = [];

  constructor() {
    if (!localStorage.getItem('tasks')) localStorage.setItem('tasks', JSON.stringify([]));
    if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
  }

  private addLog(method: ApiLog['method'], endpoint: string, status: number, payload?: any, response?: any) {
    const log: ApiLog = {
      id: uuidv4(),
      method,
      endpoint,
      status,
      payload,
      response,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(log);
    this.onLogListeners.forEach(l => l(log));
  }

  public onLog(callback: (log: ApiLog) => void) {
    this.onLogListeners.push(callback);
  }

  // Auth Endpoints
  async register(name: string, email: string): Promise<User> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser: User = { id: uuidv4(), name, email, token: `mock-jwt-${Date.now()}` };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    this.addLog('POST', '/auth/register', 201, { name, email }, newUser);
    return newUser;
  }

  async login(email: string): Promise<User | null> {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
      this.addLog('POST', '/auth/login', 200, { email }, user);
      return user;
    }
    this.addLog('POST', '/auth/login', 401, { email }, { error: 'Unauthorized' });
    return null;
  }

  // Task Endpoints (CRUD)
  async getTasks(userId: string): Promise<Task[]> {
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const userTasks = allTasks.filter(t => t.userId === userId);
    this.addLog('GET', '/tasks', 200, null, { count: userTasks.length });
    return userTasks;
  }

  async createTask(userId: string, data: Partial<Task>): Promise<Task> {
    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask: Task = {
      id: uuidv4(),
      userId,
      title: data.title || 'Untitled',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'pending',
      category: data.category || 'General',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      subtasks: data.subtasks || [],
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.addLog('POST', '/tasks', 201, data, newTask);
    return newTask;
  }

  async updateTask(taskId: string, data: Partial<Task>): Promise<Task | null> {
    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      this.addLog('PUT', `/tasks/${taskId}`, 404, data, { error: 'Not Found' });
      return null;
    }
    tasks[index] = { ...tasks[index], ...data };
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.addLog('PUT', `/tasks/${taskId}`, 200, data, tasks[index]);
    return tasks[index];
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filtered = tasks.filter(t => t.id !== taskId);
    const deleted = tasks.length !== filtered.length;
    localStorage.setItem('tasks', JSON.stringify(filtered));
    this.addLog('DELETE', `/tasks/${taskId}`, deleted ? 204 : 404, null, null);
    return deleted;
  }

  getLogs() {
    return this.logs;
  }
}

export const api = new ApiService();
