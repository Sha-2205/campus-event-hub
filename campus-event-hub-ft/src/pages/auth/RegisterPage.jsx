import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Compass, UserPlus } from 'lucide-react';
import Card from '../../components/common/Card';
import RegisterForm from '../../components/auth/RegisterForm';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleRegisterSubmit = async ({ name, email, major, password }) => {
    setError('');
    setLoading(true);

    const result = await register(email, password, name, major);
    setLoading(false);

    if (result.success) {
      showToast('Registration complete! Welcome to Campus Event Hub.', 'success');
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight text-white">Create Account</h1>
            <p className="text-slate-400 text-sm mt-1">Get matched with events, form teams, and collaborate.</p>
          </div>
        </div>

        {/* Primary Signup Card wrapping modular RegisterForm */}
        <Card className="border-slate-800 bg-slate-900/40 shadow-2xl p-8 rounded-2xl">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
            <UserPlus className="w-4.5 h-4.5 text-indigo-400" />
            Sign Up
          </h2>

          <RegisterForm
            onSubmit={handleRegisterSubmit}
            error={error}
            loading={loading}
          />

          <p className="text-center text-xs text-slate-400 mt-6 font-medium">
            Already have a hub profile?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors underline font-semibold">
              Sign in instead
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
