import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, ClipboardList, Settings, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Requests', value: stats.totalRequests, icon: <ClipboardList className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Pending', value: stats.pending, icon: <Clock className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Approved', value: stats.approved, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Admin Control Panel</h1>
        <p className="text-zinc-500">Overview of system activity and project requests.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <TrendingUp className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="text-3xl font-bold text-zinc-900">{card.value}</div>
            <div className="text-sm text-zinc-500 font-medium">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/requests" className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
              <ClipboardList className="w-6 h-6 text-zinc-400 group-hover:text-emerald-600 mb-2" />
              <div className="font-bold text-sm">Manage Requests</div>
              <div className="text-xs text-zinc-500">Review and update status</div>
            </Link>
            <Link to="/admin/users" className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
              <Users className="w-6 h-6 text-zinc-400 group-hover:text-emerald-600 mb-2" />
              <div className="font-bold text-sm">Manage Users</div>
              <div className="text-xs text-zinc-500">View and delete users</div>
            </Link>
            <Link to="/admin/settings" className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
              <Settings className="w-6 h-6 text-zinc-400 group-hover:text-emerald-600 mb-2" />
              <div className="font-bold text-sm">Cost Controls</div>
              <div className="text-xs text-zinc-500">Update market rates</div>
            </Link>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 opacity-50 cursor-not-allowed">
              <TrendingUp className="w-6 h-6 text-zinc-400 mb-2" />
              <div className="font-bold text-sm">Analytics</div>
              <div className="text-xs text-zinc-500">Coming soon</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl font-bold">System Health</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Database Connection</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">API Server</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Online
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Storage Usage</span>
                <span className="text-zinc-200">12%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[12%]"></div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
