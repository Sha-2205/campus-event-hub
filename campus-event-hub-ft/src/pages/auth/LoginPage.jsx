import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Compass, KeyRound } from 'lucide-react';
import Card from '../../components/common/Card';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async ({ email, password }) => {
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showToast('Logged in successfully! Welcome to the Hub.', 'success');
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error);
    }
  };

  // Quick sandbox trigger to sign in instantly during development
  const quickLogin = async (userEmail) => {
    setError('');
    setLoading(true);

    const result = await login(userEmail, 'password');
    setLoading(false);

    if (result.success) {
      showToast(`Logged in as ${userEmail}!`, 'success');
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const testAccounts = [
    { email: 'harshavivek05@gmail.com', name: 'Harsha (Admin/Lead)' },
    { email: 'sarah.smith@campus.edu', name: 'Sarah (Developer)' },
    { email: 'emily.chen@campus.edu', name: 'Emily (Designer)' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background radial gradient circles */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-linear-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-white">Campus Event Hub</h1>
            <p className="text-slate-400 text-sm mt-1">Collab, matching, and events designed for students.</p>
          </div>
        </div>

        {/* Primary Auth Form Card wrapping modular LoginForm */}
        <Card className="border-slate-800 bg-slate-900/40 shadow-2xl p-8 rounded-2xl">
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-indigo-400" />
              Sign In
            </h2>

            <LoginForm
              onSubmit={handleLoginSubmit}
              error={error}
              loading={loading}
              onQuickLogin={quickLogin}
              testAccounts={testAccounts}
            />
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 font-medium">
            New to the campus hub?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors underline font-semibold">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
