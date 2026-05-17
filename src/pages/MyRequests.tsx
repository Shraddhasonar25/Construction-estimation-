import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ExternalLink } from 'lucide-react';

export default function MyRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  const filteredRequests = requests.filter(r => 
    r.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">My Requests</h1>
        <p className="text-zinc-500">Track and manage all your construction project estimates.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search projects or locations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-all shadow-sm">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Project Details</th>
                <th className="px-6 py-4">Area</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Estimate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-zinc-400">Loading requests...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-zinc-400">No requests found.</td></tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900">{req.projectName}</div>
                      <div className="text-xs text-zinc-500">{req.location}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{req.area.toLocaleString()} sqft</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                        req.materialQuality === 'high' ? 'bg-purple-50 text-purple-700' : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {req.materialQuality}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{req.estimatedCost.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
