
import { CheckSquare } from 'lucide-react';

interface TodoHeaderProps {
  className?: string;
}

const TodoHeader = ({ className = '' }: TodoHeaderProps) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="bg-primary/10 p-2 rounded-full">
        <CheckSquare className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-foreground whitespace-nowrap">Todo Master</h1>
    </div>
  );
};

export default TodoHeader;
