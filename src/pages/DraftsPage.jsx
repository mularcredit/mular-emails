import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Search, Loader2, Trash2, Edit3, FileEdit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/drafts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDrafts(await res.json());
      }
    } catch (e) {
      toast.error('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/drafts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Draft permanently deleted');
        fetchDrafts();
      }
    } catch (e) {
      toast.error('Deletion failed');
    }
  };

  const filtered = drafts.filter(d => 
    d.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Saved Drafts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Resume editing incomplete emails</p>
        </div>
      </div>

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 min-w-56 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drafts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Subject', 'Last Saved', 'Recipients (To)', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400 text-sm">
                    <FileEdit size={32} className="text-gray-200 mx-auto mb-2" />
                    <p>No drafts found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 max-w-xs truncate font-medium text-gray-800">
                      {d.subject || '(No Subject)'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {new Date(d.updated_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {(d.recipients?.to || []).map((t, i) => (
                          <Badge key={i}>{t}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/compose?draftId=${d.id}`)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors" title="Edit Draft">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
