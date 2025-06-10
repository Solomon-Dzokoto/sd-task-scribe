import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { Label } from '../components/ui/label';
import { Icons } from '@/components/ui/icons';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { z } from 'zod';
import { FormError } from '../components/ui/form-error';
import { cn } from '../lib/utils';
import { loginSchema, type LoginFormData } from '../lib/validations';

export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const validateForm = () => {
        try {
            loginSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: typeof errors = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as keyof LoginFormData] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof LoginFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            await login(formData.email, formData.password);
            setIsSuccess(true);
            toast({
                title: "Welcome back!",
                description: "You've been successfully logged in.",
            });

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            setIsSuccess(false);
            toast({
                title: "Login failed",
                description: "Please check your credentials and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Icons.logo className="mr-2 h-6 w-6" />
                    Task Scribe Toolkit
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "This task management app has transformed how I organize my work. It's simple, elegant, and incredibly effective."
                        </p>
                        <footer className="text-sm">Solomon Dzokoto</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card className={cn("p-6 transition-all duration-300",
                        isSuccess && "border-green-500 shadow-lg shadow-green-100")}>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-semibold tracking-tight">
                                Welcome back
                            </CardTitle>
                            <CardDescription>
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading || isSuccess}
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={cn(
                                            "transition-all duration-200",
                                            errors.email && "border-red-500 focus-visible:ring-red-500",
                                            isSuccess && "border-green-500 focus-visible:ring-green-500"
                                        )}
                                    />
                                    {errors.email && <FormError message={errors.email} />}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        disabled={isLoading || isSuccess}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={cn(
                                            "transition-all duration-200",
                                            errors.password && "border-red-500 focus-visible:ring-red-500",
                                            isSuccess && "border-green-500 focus-visible:ring-green-500"
                                        )}
                                    />
                                    {errors.password && <FormError message={errors.password} />}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full transition-all duration-200",
                                        isSuccess && "bg-green-500 hover:bg-green-600"
                                    )}
                                    disabled={isLoading || isSuccess}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner className="mr-2" />
                                            Signing in...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <Icons.check className="mr-2 h-4 w-4" />
                                            Signed in successfully
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </Button>
                                <p className="px-8 text-center text-sm text-muted-foreground">
                                    New here?{' '}
                                    <Link
                                        to="/register"
                                        className="hover:text-primary underline underline-offset-4"
                                    >
                                        Create an account
                                    </Link>
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
