interface LoadingSpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

export function LoadingSpinner({
    className,
    size = 'md',
    fullScreen = false
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4'
    };

    const spinner = (
        <div
            className={`inline-block animate-spin rounded-full border-solid border-primary border-r-transparent ${sizeClasses[size]} ${className}`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
}
