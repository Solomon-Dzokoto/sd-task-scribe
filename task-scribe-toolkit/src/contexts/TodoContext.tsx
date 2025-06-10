import React, { createContext, useContext, useState, useEffect } from 'react';
import { Todo, TodoFilters, TodoContextType } from '@/types/todo';
import { tasksApi } from '../lib/api';
import { useAuth } from './AuthContext';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [filters, setFiltersState] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  // Load todos from API when user is authenticated
  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const tasks = await tasksApi.getTasks();
      setTodos(
        tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          status: task.completed ? 'completed' : 'pending',
          priority: task.priority || 'medium',
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        }))
      );
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await tasksApi.createTask({
        title: todoData.title,
        description: todoData.description,
      });

      const newTodo: Todo = {
        id: response.id,
        ...todoData,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      setTodos(prev => [...prev, newTodo]);

      return response
    } catch (error) {
      console.error('Failed to add todo:', error);
      throw error;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await tasksApi.updateTask(id, {
        title: updates.title,
        description: updates.description,
        completed: updates.status === 'completed',
        dueDate: updates.dueDate,
      });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id
            ? { ...todo, ...updates, updatedAt: response.updatedAt }
            : todo
        )
      );
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  };

  const toggleTodoStatus = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      await updateTodo(id, { status: newStatus });
    }
  };

  const setFilters = (newFilters: Partial<TodoFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const reorderTodos = (startIndex: number, endIndex: number) => {
    setTodos(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const value: TodoContextType = {
    todos,
    filters,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    setFilters,
    reorderTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
