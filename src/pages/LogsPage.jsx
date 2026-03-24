import { useState, useMemo, useEffect } from 'react';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, RefreshCw, Download, ChevronDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['All', 'requests', 'delivered', 'opened', 'clicked', 'bounces', 'deferred'];

export default function LogsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/brevo/smtp/statistics/events');
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.events || []).map((e, index) => ({
          id: e.messageId + index,
          recipient: e.email,
          subject: e.subject || 'No Subject',
          status: e.event,
          method: 'Brevo',
          time: new Date(e.date).toLocaleString(),
          messageId: e.messageId
        }));
        setLogs(formatted);
      }
    } catch (e) {
      toast.error('Failed to load live logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        l.recipient.toLowerCase().includes(search.toLowerCase()) ||
        l.subject.toLowerCase().includes(search.toLowerCase()) ||
        l.messageId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [logs, search, statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sent Emails & Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track all outgoing emails and their delivery status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Download}>Export CSV</Button>
          <Button variant="secondary" size="sm" icon={RefreshCw} loading={refreshing} onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      <Card padding={false}>
        {/* Filters */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipient, subject, message ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Recipient', 'Subject', 'Status', 'Method', 'Time Sent', 'Message ID'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    <span className="flex items-center gap-1">{h} <ChevronDown size={11} className="text-gray-300" /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-gray-200" />
                      <p>No emails found matching your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-gray-800 text-sm">{log.recipient}</span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <span className="text-gray-600 text-sm truncate block">{log.subject}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge>{log.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge variant={log.method.toLowerCase()}>{log.method}</Badge>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-500 text-xs">
                      {log.time}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-400 text-xs font-mono">
                      {log.messageId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Showing {filtered.length} of {logs.length} emails</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs">Previous</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
