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
          router.push('/quiz');
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
            router.push('/quiz');
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
              router.push('/quiz');
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
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 pt-28 pb-16">
        <div className="relative w-full max-w-md space-y-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center shadow-2xl backdrop-blur-md">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />

          {/* Logo / Header */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-600/10 text-indigo-400">
                <Compass className="h-6 w-6 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {isSignUp ? 'Create your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400">
              {isSignUp
                ? 'Sign up to take career assessments and schedule mentorships'
                : 'Sign in to access your dashboard and reports'}
            </p>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-left text-xs ${
                message.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400'
                  : 'border-rose-500/20 bg-rose-950/20 text-rose-400'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4.5 w-4.5 shrink-0" />
              ) : (
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              )}
              <p className="leading-snug">{message.text}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-2.5 left-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Saksham Gupta"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="placeholder-slate-650 w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pr-4 pl-10 text-xs text-white transition-colors outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-2.5 left-3 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="placeholder-slate-650 w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pr-4 pl-10 text-xs text-white transition-colors outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="placeholder-slate-650 w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pr-4 pl-10 text-xs text-white transition-colors outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="placeholder-slate-650 w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pr-10 pl-10 text-xs text-white transition-colors outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/15 transition-all hover:bg-indigo-700"
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
          <div className="border-t border-slate-800/40 pt-2 text-xs text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
              className="cursor-pointer border-none bg-transparent font-bold text-indigo-400 underline transition-colors outline-none hover:text-indigo-300"
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
