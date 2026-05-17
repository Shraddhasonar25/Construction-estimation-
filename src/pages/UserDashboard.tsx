import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { ClipboardList, Clock, CheckCircle, XCircle, FilePlus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: 'Total Requests', value: requests.length, icon: <ClipboardList className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, icon: <XCircle className="w-5 h-5" />, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Welcome, {user?.name}!</h1>
          <p className="text-zinc-500">Here's an overview of your construction project requests.</p>
        </div>
        <Link to="/create-request" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 self-start shadow-lg shadow-emerald-100">
          <FilePlus className="w-5 h-5" /> New Request
        </Link>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            <div className="text-sm text-zinc-500 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Requests</h2>
          <Link to="/my-requests" className="text-emerald-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Area (sqft)</th>
                <th className="px-6 py-4">Estimate</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-400">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-400">No requests found. Create your first one!</td></tr>
              ) : (
                requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{req.projectName}</td>
                    <td className="px-6 py-4 text-zinc-600">{req.location}</td>
                    <td className="px-6 py-4 text-zinc-600">{req.area.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{req.estimatedCost.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
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
