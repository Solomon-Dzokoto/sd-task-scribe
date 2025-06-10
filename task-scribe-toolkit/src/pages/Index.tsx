import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { UserMenu } from '../components/UserMenu';
import { useToast } from '../components/ui/use-toast';
import TodoHeader from '../components/TodoHeader';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';
import TodoFilters from '../components/TodoFilters';
import TodoStats from '../components/TodoStats';
import { Calendar } from 'lucide-react';


export default function Index() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);


  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: 'Welcome back!',
          description: `Hello ${user?.name || 'Guest'}, ${greeting}!`,
          duration: 3000,
        });
      }, 1000);
    }
  }, [isLoading]);

  const message = ` ${greeting}, ${user?.name || 'Guest'}!`;

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 bg-sidebar border-r">
        <div className="flex h-16 items-center border-b px-4">
          <TodoHeader />
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-1.5 mb-6">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome back, <span className="text-blue-700 font-extrabold truncate line-clamp-1"> {user?.name}</span>
            </p>
            <div className="flex gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          <TodoStats />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:pl-72 w-full">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between md:justify-end px-3 md:px-4">
            <TodoHeader className="md:hidden" />
            <div className="flex-1 max-md:hidden">
              <h1 className="text-lg md:text-xl font-semibold text-foreground">
                {message}
              </h1>
            </div>
            <UserMenu />
          </div>
        </header>
        <main className="w-full px-3 py-4 md:container md:mx-auto md:p-6 lg:p-8 md:max-w-3xl lg:max-w-4xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Tasks</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Organize your tasks and boost your productivity
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            <TodoForm />
            <TodoFilters className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-20 z-40 -mx-3 px-3 py-2 md:-mx-6 md:px-6 md:py-3 border-b" />
            <TodoList />
          </div>
        </main>
      </div>
    </div>
  );
}
