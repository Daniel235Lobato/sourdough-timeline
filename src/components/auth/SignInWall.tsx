import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';

export const SignInWall: React.FC = () => {
  const { login, register, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      const res = await register(name, email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter both email and password.');
        return;
      }

      setIsSubmitting(true);
      const res = await login(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to sign in.');
      }
    }
  };

  const handleGoogleClick = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#FAF5EE] text-[#2E1E14] flex flex-col justify-center items-center px-4 py-8 select-none">
      <div className="w-full max-w-sm mx-auto space-y-4 animate-fade-in">
        {/* Brand Logo & Introduction */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          <div className="w-14 h-14 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center p-2 shadow-sm">
            <Logo size={42} className="w-full h-full" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-[#2E1E14] tracking-tight leading-none">
              Levain
            </h1>
            <p className="text-xs sm:text-sm text-[#2E1E14]/75 mt-1 font-medium">
              Handcrafted Sourdough Fermentation Timelines
            </p>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-[#E7CEB5] border border-[#D1C1A8] rounded-3xl p-5 shadow-card space-y-4">
          {/* Segmented Mode Selector */}
          <div className="relative flex p-1 bg-[#FAF5EE] border border-[#D1C1A8] rounded-xl">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-[#2E1E14] transition-all duration-200 ease-out shadow-xs"
              style={{
                left: mode === 'signin' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
              }}
            />

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`relative z-10 w-1/2 py-2 text-center text-xs font-bold rounded-lg transition-colors active-press ${
                mode === 'signin' ? 'text-[#FAF5EE]' : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`relative z-10 w-1/2 py-2 text-center text-xs font-bold rounded-lg transition-colors active-press ${
                mode === 'register' ? 'text-[#FAF5EE]' : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-2.5 flex items-start space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#836A4D] block">
                  Baker Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#836A4D]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sourdough Sam"
                    className="w-full bg-[#FAF5EE] border border-[#D1C1A8] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#2E1E14] placeholder-[#2E1E14]/40 focus:outline-hidden focus:ring-1 focus:ring-[#986A4C]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#836A4D] block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#836A4D]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="baker@example.com"
                  className="w-full bg-[#FAF5EE] border border-[#D1C1A8] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#2E1E14] placeholder-[#2E1E14]/40 focus:outline-hidden focus:ring-1 focus:ring-[#986A4C]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#836A4D] block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#836A4D]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter password'}
                  className="w-full bg-[#FAF5EE] border border-[#D1C1A8] rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#2E1E14] placeholder-[#2E1E14]/40 focus:outline-hidden focus:ring-1 focus:ring-[#986A4C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#836A4D] hover:text-[#2E1E14] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#836A4D] block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#836A4D]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-[#FAF5EE] border border-[#D1C1A8] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#2E1E14] placeholder-[#2E1E14]/40 focus:outline-hidden focus:ring-1 focus:ring-[#986A4C]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2E1E14] hover:bg-[#986A4C] disabled:opacity-50 text-[#FAF5EE] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active-press"
            >
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-[#D1C1A8]" />
            <span className="shrink mx-3 text-[10px] uppercase font-bold text-[#836A4D]">
              or continue with
            </span>
            <div className="grow border-t border-[#D1C1A8]" />
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 border border-[#D1C1A8] text-[#2E1E14] font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center space-x-2.5 active-press disabled:opacity-50"
          >
            {/* Official Google G Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
