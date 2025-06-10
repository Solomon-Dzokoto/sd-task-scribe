import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TodoProvider } from './contexts/TodoContext';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';
import Login from './pages/Login';
import Register from './pages/Register';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  // if (loading) {
  //   return <LoadingSpinner />
  // }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoProvider>
              <Index />
            </TodoProvider>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
