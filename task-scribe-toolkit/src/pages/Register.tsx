import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { Label } from '../components/ui/label';
import { Icons } from '../components/ui/icons';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { FormError } from '../components/ui/form-error';
import { cn } from '../lib/utils';


export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await register(formData.name, formData.email, formData.password);
            toast({
                title: 'Success',
                description: 'Registration successful',
            });
            navigate('/')
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Registration failed. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Icons.logo className="mr-2 h-6 w-6" />
                    Task Scribe Toolkit
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "Join our community of organized professionals. Start managing your tasks effectively today."
                        </p>
                        <footer className="text-sm">Task Scribe Team</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card className="p-6">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-semibold tracking-tight">
                                Create an account
                            </CardTitle>
                            <CardDescription>
                                Enter your information to create your account
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        type="text"
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        value={formData?.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        value={formData?.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData?.password}
                                        onChange={(e) => handleChange("password", e.target.value)}

                                        required
                                        minLength={6}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                                    {isLoading ? 'Creating account...' : 'Create account'}
                                </Button>
                                <p className="px-8 text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="hover:text-primary underline underline-offset-4"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
