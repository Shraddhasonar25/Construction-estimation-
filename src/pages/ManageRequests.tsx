import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';

export default function ManageRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchRequests = () => {
    fetch('/api/admin/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchRequests();
        if (selectedRequest?.id === id) setSelectedRequest(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900">Manage Project Requests</h1>
        <p className="text-zinc-500">Review, approve, or reject construction estimate requests.</p>
      </header>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Estimate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-400">Loading requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-400">No requests found.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{req.userName}</div>
                      <div className="text-xs text-zinc-500">{req.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900">{req.projectName}</div>
                      <div className="text-xs text-zinc-500">{req.location} • {req.area} sqft</div>
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(req.id, 'approved')}
                              className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(req.id, 'rejected')}
                              className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center  p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative"
          >
            <button 
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <header>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Project Details</div>
                <h2 className="text-3xl font-bold">{selectedRequest.projectName}</h2>
                <p className="text-zinc-500">{selectedRequest.location}</p>
              </header>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-zinc-50 rounded-2xl">
                  <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Area</div>
                  <div className="text-xl font-bold">{selectedRequest.area.toLocaleString()} sqft</div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl">
                  <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Construction Type</div>
                  <div className="text-xl font-bold capitalize">{selectedRequest.constructionType}</div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl">
                  <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Material Quality</div>
                  <div className="text-xl font-bold capitalize">{selectedRequest.materialQuality}</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <div className="text-xs text-emerald-600 uppercase font-bold mb-1">Estimated Cost</div>
                  <div className="text-xl font-bold text-emerald-700">₹{selectedRequest.estimatedCost.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-zinc-500 uppercase font-bold">Description</div>
                <p className="text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-2xl">
                  {selectedRequest.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-100 flex gap-4">
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  Approve Request
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                  className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-all"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
