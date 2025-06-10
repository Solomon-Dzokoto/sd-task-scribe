
export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilters {
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface TodoContextType {
  todos: Todo[];
  filters: TodoFilters;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoStatus: (id: string) => void;
  setFilters: (filters: Partial<TodoFilters>) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
}
