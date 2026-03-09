import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showMfa, setShowMfa] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setShowMfa(true);
  };

  const handleMfaSubmit = (e) => {
    e.preventDefault();
    // Simulate successful login/MFA
    navigate('/dashboard');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Side: Notary Architecture Graphic */}
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-center items-center overflow-hidden bg-background-dark border-r border-primary/10">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]"></div>
          </div>
          {/* Architecture Illustration Overlay */}
          <div className="relative z-10 w-full max-w-xl p-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-primary"></div>
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Security Infrastructure</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">NimbusEase Notary Architecture</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">Our decentralized trust model ensures that your data remains immutable, encrypted, and accessible only by verified identities.</p>
            </div>
            {/* Graphic Placeholder */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden glass-panel border border-primary/20 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
              {/* Mocking the "Notary Logic" with CSS and Icons */}
              <div className="relative flex flex-col items-center gap-8">
                <div className="grid grid-cols-3 gap-12 relative">
                  {/* Connection Lines (Visual Only) */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/30 -translate-y-1/2"></div>
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-primary/30 -translate-x-1/2"></div>
                  {/* Nodes */}
                  <div className="size-16 rounded-xl bg-background-dark border-2 border-primary flex items-center justify-center glow-subtle z-10">
                    <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                  </div>
                  <div className="size-16 rounded-xl bg-background-dark border-2 border-primary flex items-center justify-center glow-subtle z-10">
                    <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                  </div>
                  <div className="size-16 rounded-xl bg-background-dark border-2 border-primary flex items-center justify-center glow-subtle z-10">
                    <span className="material-symbols-outlined text-primary text-3xl">token</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-sm">lock</span>
                  <span className="text-primary text-xs font-mono tracking-widest">ENCRYPTION_ACTIVE:AES-256-GCM</span>
                </div>
              </div>
            </div>
            {/* Status Badge */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex h-3 w-3 relative">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></div>
                <div className="relative inline-flex rounded-full h-3 w-3 bg-primary"></div>
              </div>
              <span className="text-sm font-medium text-primary tracking-wide">Zero-Trust Protocol Active</span>
            </div>
          </div>
        </div>
        {/* Right Side: Login & MFA Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-24 bg-background-light dark:bg-background-dark">
          {/* Branding Mobile */}
          <div className="lg:hidden mb-12 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">shield_locked</span>
            <h1 className="text-2xl font-bold tracking-tight">NimbusEase</h1>
          </div>
          <div className="w-full max-w-md space-y-8">
            {/* Header Section */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Verify Identity to Access the Vault
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Please sign in to your secure account to continue.
              </p>
            </div>
            {/* Main Login Form */}
            <form onSubmit={handleLogin} className="mt-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-sm">mail</span>
                    </div>
                    <input autoComplete="email" className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-lg focus:ring-primary focus:border-primary text-sm placeholder-slate-400 dark:text-white" id="email" name="email" placeholder="name@nimbusease.io" required type="email"/>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                    <div className="text-sm">
                      <a className="font-medium text-primary hover:text-primary/80" href="#">Forgot password?</a>
                    </div>
                  </div>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-sm">lock</span>
                    </div>
                    <input autoComplete="current-password" class="block w-full pl-10 pr-12 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-lg focus:ring-primary focus:border-primary text-sm placeholder-slate-400 dark:text-white" id="password" name="password" placeholder="••••••••" required type="password"/>
                    <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200" type="button">
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-800 rounded bg-white dark:bg-slate-900" id="remember-me" name="remember-me" type="checkbox"/>
                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="remember-me">
                  Trust this device for 30 days
                </label>
              </div>
              <div>
                <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-background-dark bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20">
                  Sign In
                </button>
              </div>
            </form>
            {/* Help Link */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="h-px w-full bg-slate-200 dark:bg-slate-800"></div>
              <button className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">support_agent</span>
                Contact Security Operations Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transition/Overlay for MFA */}
      {showMfa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-md" id="mfa-overlay">
          <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-primary/30 shadow-2xl relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => setShowMfa(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">security</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Security Verification</h3>
              <p className="text-slate-400 text-sm mb-8">
                Enter the 6-digit TOTP code from your <strong>Google Authenticator</strong> app to authorize access to the vault.
              </p>
              <form onSubmit={handleMfaSubmit} className="space-y-8">
                <div className="flex justify-between gap-2 sm:gap-4">
                  <input className="mfa-digit-input w-full aspect-square text-center text-2xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-primary focus:border-primary outline-none transition-all" maxLength="1" type="text" defaultValue="4"/>
                  <input className="mfa-digit-input w-full aspect-square text-center text-2xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-primary focus:border-primary outline-none transition-all" maxLength="1" type="text" defaultValue="8"/>
                  <input className="mfa-digit-input w-full aspect-square text-center text-2xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-primary focus:border-primary outline-none transition-all" maxLength="1" placeholder="·" type="text"/>
                  <input className="mfa-digit-input w-full aspect-square text-center text-2xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-primary focus:border-primary outline-none transition-all" maxLength="1" placeholder="·" type="text"/>
                  <input className="mfa-digit-input w-full aspect-square text-center text-2xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-primary focus:border-primary outline-none transition-all" maxLength="1" placeholder="·" type="text"/>
                  <input className="mfa-digit-input w-full aspect-square text-center text-2xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-primary focus:border-primary outline-none transition-all" maxlength="1" placeholder="·" type="text"/>
                </div>
                <div className="space-y-4">
                  <button className="w-full py-3 px-4 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20" type="submit">
                    Verify and Unlock Vault
                  </button>
                  <button className="text-sm text-slate-400 hover:text-primary transition-colors" type="button">
                    Lost access to your device?
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary text-xs">shield</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol: ZERO-TRUST_ENFORCED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
