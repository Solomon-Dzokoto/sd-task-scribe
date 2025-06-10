import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTodo } from '@/contexts/TodoContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTodo } = useTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await addTodo({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate?.toISOString(),
        status: 'pending',
        priority: 'medium',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-3 p-3 md:space-y-4 md:p-4">
        <div className="flex flex-col space-y-3">
          <Input
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="text-sm md:text-base"
          />
          <Textarea
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="min-h-[80px] md:min-h-[100px] text-sm md:text-base"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'w-full sm:w-auto justify-start text-left text-sm font-normal',
                  !dueDate && 'text-muted-foreground'
                )}
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : <span>Set due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="w-full sm:w-auto text-sm md:text-base"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Task'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TodoForm;
