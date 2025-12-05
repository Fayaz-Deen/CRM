import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authApi.login(data.email, data.password);
      setAuth(response.user, response.token, response.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Decorative with Nulogic brand gradient (Red → Pink → Purple) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #ef4444 0%, #db2777 35%, #a855f7 70%, #7c3aed 100%)' }}>
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute inset-0">
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <img src="/logo.png" alt="Nulogic" className="h-12 object-contain" />
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Build stronger<br />relationships
          </h1>

          <p className="text-xl text-white/80 mb-8 max-w-md">
            Keep track of your contacts, never miss a birthday, and nurture your professional network with ease.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-sm font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-white/80">Join 10,000+ professionals</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[hsl(var(--background))] p-6 sm:p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center mb-8">
            <img src="/logo.png" alt="Nulogic" className="h-10 object-contain" />
          </div>

          <Card className="border-0 shadow-strong">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow animate-float">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-base">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 p-4 text-sm text-[hsl(var(--destructive))] animate-fade-in flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--destructive))]" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-[hsl(var(--primary))]" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="pl-12 h-12 text-base"
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors group-focus-within:text-[hsl(var(--primary))]" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="pl-12 pr-12 h-12 text-base"
                      {...register('password')}
                      error={errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity btn-press group"
                  isLoading={isLoading}
                >
                  Sign in
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pt-2 pb-6">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 transition-colors">
                  Sign up for free
                </Link>
              </p>
            </CardFooter>
          </Card>

          <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-[hsl(var(--foreground))]">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-[hsl(var(--foreground))]">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
