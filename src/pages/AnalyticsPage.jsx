import { mockAnalytics } from '../data/mockData';
import Card, { CardHeader } from '../components/ui/Card';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Send, CheckCircle, XCircle, Eye, MousePointer, AlertTriangle } from 'lucide-react';

const KPI_CARDS = [
  { label: 'Total Sent', key: 'totalSent', icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50', format: (v) => v.toLocaleString() },
  { label: 'Delivered', key: 'delivered', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', format: (v) => v.toLocaleString() },
  { label: 'Failed', key: 'failed', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', format: (v) => v.toLocaleString() },
  { label: 'Open Rate', key: 'openRate', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', format: (v) => `${v}%` },
  { label: 'Click Rate', key: 'clickRate', icon: MousePointer, color: 'text-violet-600', bg: 'bg-violet-50', format: (v) => `${v}%` },
  { label: 'Bounce Rate', key: 'bounceRate', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', format: (v) => `${v}%` },
];

const PIE_COLORS = ['#4f46e5', '#6b7280'];
const BAR_COLORS = { Delivered: '#10b981', Opened: '#6366f1', Clicked: '#8b5cf6', Failed: '#ef4444', Deferred: '#f59e0b' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { summary, dailySent, methodSplit, statusBreakdown } = mockAnalytics;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Email delivery performance for the last 30 days</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {KPI_CARDS.map(({ label, key, icon: Icon, color, bg, format }) => (
          <Card key={key} className="text-center !p-4">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none">{format(summary[key])}</p>
            <p className="text-xs text-gray-500 mt-1.5 font-medium">{label}</p>
          </Card>
        ))}
      </div>

      {/* Main charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Line chart — span 2 */}
        <Card className="lg:col-span-2">
          <CardHeader title="Email Activity" description="Emails sent and delivered over time" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailySent} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="sent" stroke="#4f46e5" strokeWidth={2} dot={false} name="Sent" />
              <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} dot={false} name="Delivered" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="3 3" name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart — method split */}
        <Card>
          <CardHeader title="Sending Method" description="Brevo API vs SMTP" />
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={methodSplit} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {methodSplit.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-1">
              {methodSplit.map((m, i) => (
                <div key={m.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {m.name} <span className="font-semibold">{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Status breakdown bar chart */}
      <Card>
        <CardHeader title="Delivery Status Breakdown" description="Total emails by status across all time" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusBreakdown} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {statusBreakdown.map((entry) => (
                <Cell key={entry.name} fill={BAR_COLORS[entry.name] || '#e5e7eb'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
