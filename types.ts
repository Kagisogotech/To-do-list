
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: number; // 1: High, 2: Medium, 3: Low
  category?: string;
  dueDate?: string;
  completedAt?: string;
}