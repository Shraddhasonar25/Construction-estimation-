import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FilePlus, MapPin, Maximize, Building2, Wallet, FileText, Calculator, Sparkles } from 'lucide-react';

export default function CreateRequest() {
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    area: '',
    constructionType: 'residential',
    materialQuality: 'standard',
    budget: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          area: parseFloat(formData.area),
          budget: formData.budget ? parseFloat(formData.budget) : null
        }),
      });
      if (res.ok) navigate('/my-requests');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">New Construction Request</h1>
        <p className="text-zinc-500">Provide your project details to get a professional cost estimate.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <FilePlus className="w-4 h-4 text-emerald-600" /> Project Name
              </label>
              <input
                required
                value={formData.projectName}
                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Dream Villa"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Location
              </label>
              <input
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <Maximize className="w-4 h-4 text-emerald-600" /> Area (Square Feet)
              </label>
              <input
                required
                type="number"
                value={formData.area}
                onChange={e => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 1500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" /> Construction Type
              </label>
              <select
                value={formData.constructionType}
                onChange={e => setFormData({ ...formData, constructionType: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Material Quality
              </label>
              <div className="flex gap-4">
                {['standard', 'high'].map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setFormData({ ...formData, materialQuality: q })}
                    className={`flex-1 py-2.5 rounded-xl border transition-all capitalize font-medium ${
                      formData.materialQuality === q 
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" /> Your Budget (Optional)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="₹"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" /> Project Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              placeholder="Tell us more about your requirements..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 text-emerald-700">
            <Calculator className="w-6 h-6" />
            <div>
              <div className="font-bold">Instant Estimation</div>
              <div className="text-xs opacity-80">Final cost will be calculated on submission</div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
