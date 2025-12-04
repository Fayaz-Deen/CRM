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
      rounded-lg
      active:scale-[0.985]
    `;

    const variants = {
      primary: `
        bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
        hover:brightness-105
        shadow-sm
      `,
      secondary: `
        bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]
        hover:bg-[hsl(var(--muted))]
      `,
      outline: `
        border border-[hsl(var(--border))] bg-transparent
        hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]
      `,
      ghost: `
        hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]
      `,
      destructive: `
        bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]
        hover:brightness-105
        shadow-sm
      `,
      success: `
        bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]
        hover:brightness-105
        shadow-sm
      `,
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2',
      icon: 'h-10 w-10',
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
