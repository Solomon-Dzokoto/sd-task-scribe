import { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Flag, Trash2, Edit, GripVertical } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';
import { Todo } from '@/types/todo';
import { format } from 'date-fns';

const TodoList = () => {
  const { todos, filters, toggleTodoStatus, deleteTodo, reorderTodos } = useTodo();

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(todo => todo.status === filters.status);
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    // Sort todos
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        }
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [todos, filters]);

  const handleDragEnd = (result: { source: { index: number }; destination?: { index: number } }) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    reorderTodos(sourceIndex, destinationIndex);
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: Todo['priority']) => {
    const baseClasses = "h-4 w-4";
    switch (priority) {
      case 'high': return <Flag className={`${baseClasses} text-red-500`} />;
      case 'medium': return <Flag className={`${baseClasses} text-yellow-500`} />;
      case 'low': return <Flag className={`${baseClasses} text-green-500`} />;
      default: return <Flag className={`${baseClasses} text-gray-500`} />;
    }
  };

  if (filteredAndSortedTodos.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 md:py-8">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
            <p className="text-base md:text-lg font-medium">No tasks found</p>
            <p className="text-xs md:text-sm">Create your first task to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-3 py-4 md:px-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Calendar className="h-4 w-4 md:h-5 md:w-5" />
          Tasks ({filteredAndSortedTodos.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 md:space-y-3"
              >
                {filteredAndSortedTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-3 md:p-4 border rounded-lg transition-all ${snapshot.isDragging
                            ? 'shadow-lg border-primary'
                            : 'border-border hover:border-primary/50'
                          } ${todo.status === 'completed'
                            ? 'bg-muted/50 opacity-75'
                            : 'bg-background'
                          }`}
                      >
                        <div className="flex items-start gap-2 md:gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="mt-1 text-muted-foreground hover:text-foreground cursor-grab"
                          >
                            <GripVertical className="h-3 w-3 md:h-4 md:w-4" />
                          </div>

                          <Checkbox
                            checked={todo.status === 'completed'}
                            onCheckedChange={() => toggleTodoStatus(todo.id)}
                            className="h-4 w-4 md:h-5 md:w-5"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <h3 className={`text-sm md:text-base font-medium ${todo.status === 'completed'
                                  ? 'line-through text-muted-foreground'
                                  : 'text-foreground'
                                }`}>
                                {todo.title}
                              </h3>

                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className={`text-xs md:text-sm whitespace-nowrap ${getPriorityColor(todo.priority)}`}>
                                  {getPriorityIcon(todo.priority)}
                                  <span className="ml-1 capitalize">{todo.priority}</span>
                                </Badge>
                              </div>
                            </div>

                            {todo.description && (
                              <p className={`text-xs md:text-sm mt-1 ${todo.status === 'completed'
                                  ? 'text-muted-foreground'
                                  : 'text-muted-foreground'
                                }`}>
                                {todo.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-[10px] md:text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Created: {format(new Date(todo.createdAt), 'MMM dd')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 md:gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:h-9 md:w-9">
                              <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTodo(todo.id)}
                              className="h-8 w-8 p-0 md:h-9 md:w-9 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default TodoList;
