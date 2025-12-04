import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
}

export function Card({ className = '', children, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-soft',
    elevated: 'bg-[hsl(var(--card))] shadow-medium hover:shadow-strong transition-shadow duration-250',
    outlined: 'bg-transparent border border-[hsl(var(--border))]',
    glass: 'glass border border-[hsl(var(--border))/40]',
  };

  return (
    <div
      className={`rounded-xl text-[hsl(var(--card-foreground))] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <p className={`text-sm text-[hsl(var(--muted-foreground))] ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: Omit<CardProps, 'variant'>) {
  return (
    <div className={`flex items-center justify-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}
