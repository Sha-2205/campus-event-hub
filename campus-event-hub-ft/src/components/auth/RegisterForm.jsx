import React, { useState } from 'react';
import { User, Mail, Lock, BookOpen, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function RegisterForm({ onSubmit, error, loading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Field-level Validation
    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setValidationError('Please enter your campus email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid campus email address.');
      return;
    }

    if (!major.trim()) {
      setValidationError('Please specify your academic major or stream.');
      return;
    }

    if (!password) {
      setValidationError('Please enter a password.');
      return;
    }

    if (password.length < 5) {
      setValidationError('Password must be at least 5 characters long for safety.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-enter.');
      return;
    }

    onSubmit({ name, email, major, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {(validationError || error) && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl p-3.5 flex items-start gap-2.5 animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{validationError || error}</span>
        </div>
      )}

      <Input
        label="Full Student Name"
        type="text"
        placeholder="e.g. Harsha Vivek"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setValidationError('');
        }}
        icon={User}
        required
        id="register-form-name-input"
      />

      <Input
        label="Campus Email Address"
        type="email"
        placeholder="e.g. myname@campus.edu"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setValidationError('');
        }}
        icon={Mail}
        required
        id="register-form-email-input"
      />

      <Input
        label="Academic Major / Stream"
        type="text"
        placeholder="e.g. Computer Science & AI"
        value={major}
        onChange={(e) => {
          setMajor(e.target.value);
          setValidationError('');
        }}
        icon={BookOpen}
        required
        id="register-form-major-input"
      />

      <Input
        label="Choose Password"
        type="password"
        placeholder="At least 5 characters"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setValidationError('');
        }}
        icon={Lock}
        required
        id="register-form-password-input"
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your chosen password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setValidationError('');
        }}
        icon={Lock}
        required
        id="register-form-confirm-password-input"
      />

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full mt-3"
        id="btn-register-form-submit"
      >
        Sign Up For Hub
      </Button>
    </form>
  );
}
