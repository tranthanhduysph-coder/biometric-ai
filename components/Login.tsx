
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { isFirebaseConfigured } from '../firebaseConfig';

export const Login: React.FC = () => {
  const { signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { t } = useAppContext();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (e) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 animate-fade-in-up">
        
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center bg-indigo-600 p-3 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5 10 10 0 0 0-4-10z"/><path d="M16 12a4 4 0 0 1-8 0"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{t('appTitle')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('appDesc')}</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-xs text-yellow-700 dark:text-yellow-300 text-center">
            <strong>Demo Mode Active:</strong> Database unavailable. Login simulated.
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('email')}
            </label>
            <input 
              type="email" 
              required
              className={inputClass}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('password')}
            </label>
            <input 
              type="password" 
              required
              minLength={6}
              className={inputClass}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? '...' : (isRegister ? t('register') : t('login'))}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isRegister ? t('haveAccount') : t('noAccount')}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline focus:outline-none"
            >
              {isRegister ? t('signInNow') : t('signUpNow')}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {t('or')}
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600 transition-all shadow-sm group hover:shadow-md"
        >
          {isFirebaseConfigured ? (
            <>
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="w-6 h-6 group-hover:scale-110 transition-transform" 
              />
              <span>{t('googleLogin')}</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{t('demoLogin')}</span>
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
