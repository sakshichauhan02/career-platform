'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  User,
  Phone,
  ShieldAlert,
  CheckCircle,
  Eye,
  EyeOff,
  Compass,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get('redirect') || '/quiz';
          router.push(redirect);
        }
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign Up Mode
        if (!fullName.trim()) {
          throw new Error('Full Name is required');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
          },
        });

        if (error) throw error;

        if (data?.user) {
          // Manually create profile row as fallback/support
          const { error: profileErr } = await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              full_name: fullName,
              email: email,
              role: 'student',
            },
            { onConflict: 'id' }
          );

          if (profileErr) console.error('Failed to create user profile row:', profileErr);

          setMessage({
            type: 'success',
            text: 'Account created successfully! Redirecting you...',
          });

          // Wait a moment and redirect
          setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect') || '/quiz';
            router.push(redirect);
          }, 1500);
        }
      } else {
        // Sign In Mode
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data?.user) {
          // Fetch role to determine redirect path
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          setMessage({
            type: 'success',
            text: 'Logged in successfully! Redirecting...',
          });

          setTimeout(() => {
            if (profile?.role === 'admin') {
              router.push('/admin');
            } else {
              const params = new URLSearchParams(window.location.search);
              const redirect = params.get('redirect') || '/quiz';
              router.push(redirect);
            }
          }, 1200);
        }
      }
    } catch (err: any) {
      console.error('Auth action error:', err);
      let errorText = err.message || 'Authentication failed. Please check your credentials.';

      if (err.message === 'Email not confirmed') {
        errorText =
          'Email verification is required. Please check your inbox to confirm your email, or turn off "Confirm email" in your Supabase Auth settings (Providers > Email).';
      }

      setMessage({
        type: 'error',
        text: errorText,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary/10 flex min-h-screen flex-col justify-between">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-16">
        <div className="border-border bg-card relative w-full max-w-md space-y-6 overflow-hidden rounded-3xl border p-8 text-center shadow-xl backdrop-blur-md">
          {/* Decorative glows */}
          <div className="bg-secondary/15 pointer-events-none absolute -top-16 -left-16 h-32 w-32 rounded-full blur-2xl" />
          <div className="bg-accent/15 pointer-events-none absolute -right-16 -bottom-16 h-32 w-32 rounded-full blur-2xl" />

          {/* Logo / Header */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="border-primary/20 bg-primary/5 text-primary flex h-12 w-12 items-center justify-center rounded-2xl border">
                <Compass className="h-6 w-6 animate-pulse" />
              </div>
            </div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              {isSignUp ? 'Create your Account' : 'Welcome Back'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isSignUp
                ? 'Sign up to take career assessments and schedule mentorships'
                : 'Sign in to access your dashboard and reports'}
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-left text-xs ${
                message.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-50/80 text-emerald-700'
                  : 'border-rose-500/20 bg-rose-50/80 text-rose-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              ) : (
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-600" />
              )}
              <p className="leading-snug">{message.text}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {isSignUp && (
              <>
                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-3 left-3.5 h-4 w-4" />
                    <input
                      type="text"
                      required
                      placeholder="Saksham Gupta"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/10 w-full rounded-full border py-2.5 pr-4 pl-11 text-xs transition-all outline-none focus:ring-2"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="text-muted-foreground absolute top-3 left-3.5 h-4 w-4" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/10 w-full rounded-full border py-2.5 pr-4 pl-11 text-xs transition-all outline-none focus:ring-2"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-3 left-3.5 h-4 w-4" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/10 w-full rounded-full border py-2.5 pr-4 pl-11 text-xs transition-all outline-none focus:ring-2"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-3 left-3.5 h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/10 w-full rounded-full border py-2.5 pr-10 pl-11 text-xs transition-all outline-none focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-3 right-3.5"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/30 mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Please wait...
                </>
              ) : isSignUp ? (
                'Sign Up'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Toggle link */}
          <div className="border-border text-muted-foreground border-t pt-4 text-xs">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
              className="text-primary hover:text-primary/80 cursor-pointer border-none bg-transparent font-bold underline transition-colors outline-none"
            >
              {isSignUp ? 'Sign In here' : 'Sign Up here'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
