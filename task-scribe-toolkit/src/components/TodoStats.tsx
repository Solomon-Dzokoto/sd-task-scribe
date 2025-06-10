
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Flag, TrendingUp } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';

const TodoStats = () => {
  const { todos } = useTodo();

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.status === 'completed').length;
    const pending = todos.filter(todo => todo.status === 'pending').length;
    
    const highPriority = todos.filter(todo => todo.priority === 'high').length;
    const mediumPriority = todos.filter(todo => todo.priority === 'medium').length;
    const lowPriority = todos.filter(todo => todo.priority === 'low').length;
    
    const overdue = todos.filter(todo => 
      todo.status === 'pending' && new Date(todo.dueDate) < new Date()
    ).length;
    
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      overdue,
      completionRate
    };
  }, [todos]);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(stats.completionRate)}%</span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Completed</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {stats.completed}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Pending</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {stats.pending}
            </Badge>
          </div>
          
          {stats.overdue > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Overdue</span>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {stats.overdue}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Priority</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-500" />
              <span className="text-sm">High</span>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {stats.highPriority}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Medium</span>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {stats.mediumPriority}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-green-500" />
              <span className="text-sm">Low</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {stats.lowPriority}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoStats;
