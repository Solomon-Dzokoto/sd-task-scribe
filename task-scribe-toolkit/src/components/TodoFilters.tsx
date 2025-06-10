
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, ArrowUpDown } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';

interface TodoFiltersProps {
  className?: string;
}

const TodoFilters = ({ className = '' }: TodoFiltersProps) => {
  const { filters, setFilters } = useTodo();

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <Card className={className}>
      <CardContent className="p-3 md:pt-6">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Filter className="h-4 w-4" />
          <span className="text-sm md:text-base font-medium">Filter & Sort</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value: any) => setFilters({ status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={filters.priority}
              onValueChange={(value: any) => setFilters({ priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: any) => setFilters({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
              })}
              className="w-full justify-start"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoFilters;
