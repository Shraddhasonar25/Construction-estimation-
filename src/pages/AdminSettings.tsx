import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Save, RefreshCcw, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Cost Estimation Controls</h1>
        <p className="text-zinc-500">Adjust the rates used for automatic cost calculations.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-8">
        <div className="space-y-6">
          {settings.map((s) => (
            <div key={s.key} className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 capitalize">
                {s.key.replace(/_/g, ' ')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={s.value}
                  onChange={e => handleUpdate(s.key, e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-bold uppercase">
                  {s.key.includes('multiplier') ? 'Multiplier' : 'Rate'}
                </div>
              </div>
              <p className="text-xs text-zinc-400">
                {s.key === 'cost_per_sqft' && 'Base construction cost per square foot.'}
                {s.key === 'material_rate_multiplier' && 'Multiplier applied for high-quality material requests.'}
                {s.key === 'labour_rate' && 'Labour cost per square foot.'}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
          <div className="text-sm text-emerald-600 font-medium">{message}</div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 -shrink-0" />
        <div className="text-sm text-amber-800">
          <div className="font-bold mb-1">Important Note</div>
          Changes to these rates will only affect <span className="font-bold">new</span> requests. Existing requests will keep their original estimates.
        </div>
      </div>
    </div>
  );
}
