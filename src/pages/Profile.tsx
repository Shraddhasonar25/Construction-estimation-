import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Mail, Lock, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined
        }),
      });

      if (res.ok) {
        setMessage('Profile updated successfully!');
        await refreshUser();
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Profile Settings</h1>
        <p className="text-zinc-500">Update your personal information and security settings.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-3xl font-bold">
              {user?.name[0].toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-bold">{user?.name}</div>
              <div className="text-zinc-500">{user?.email}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">{user?.role} Account</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" /> Full Name
              </label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" /> Email Address
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> New Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
          {message && <div className="text-emerald-600 text-sm font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {message}</div>}

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
