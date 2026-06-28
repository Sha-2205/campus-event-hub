import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function LoginForm({
  onSubmit,
  error,
  loading
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Basic Form Validation
    if (!email.trim() || !password) {
      setValidationError(
        'Both email and password are required.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setValidationError(
        'Please enter a valid campus email address.'
      );
      return;
    }

    onSubmit({ email, password, rememberMe });
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {(validationError || error) && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl p-3.5 flex items-start gap-2.5 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{validationError || error}</span>
          </div>
        )}

        <Input
          label="Campus Email Address"
          type="email"
          placeholder="e.g. name@campus.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setValidationError('');
          }}
          icon={Mail}
          required
          id="login-form-email-input"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setValidationError('');
          }}
          icon={Lock}
          required
          id="login-form-password-input"
        />

        {/* Remember Session */}
        <div className="flex items-center justify-between mt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950"
              id="login-form-remember-checkbox"
            />
            <span className="font-medium">
              Remember my session
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full mt-2"
          id="btn-login-form-submit"
        >
          Sign In to Hub
        </Button>
      </form>
    </div>
  );
}