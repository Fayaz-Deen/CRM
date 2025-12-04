import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[hsl(var(--foreground))]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            flex h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))]
            px-3 py-2 text-sm text-[hsl(var(--foreground))]
            placeholder:text-[hsl(var(--muted-foreground))]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-[hsl(var(--destructive))]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
