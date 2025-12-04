import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--ring))]
      disabled:pointer-events-none disabled:opacity-50
      rounded-xl
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
        hover:bg-[hsl(var(--primary))]/90
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]
        hover:bg-[hsl(var(--secondary))]/80
        shadow-sm
      `,
      outline: `
        border-2 border-[hsl(var(--input))] bg-transparent
        hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]
        hover:border-[hsl(var(--accent))]
      `,
      ghost: `
        hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]
      `,
      destructive: `
        bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]
        hover:bg-[hsl(var(--destructive))]/90
        shadow-sm hover:shadow-md
      `,
      success: `
        bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]
        hover:bg-[hsl(var(--success))]/90
        shadow-sm hover:shadow-md
      `,
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm gap-1.5',
      md: 'h-11 px-5 text-sm gap-2',
      lg: 'h-13 px-7 text-base gap-2',
      icon: 'h-11 w-11',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
