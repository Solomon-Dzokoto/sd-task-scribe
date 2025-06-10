export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
