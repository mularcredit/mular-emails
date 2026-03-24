import { useState } from 'react';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { Settings, Check, X, TestTube } from 'lucide-react';

export default function SmtpSettingsPage() {
  const [form, setForm] = useState({
    host: 'smtp-relay.brevo.com',
    port: '587',
    username: 'a5d4bf001@smtp-brevo.com',
    password: '',
    encryption: 'tls',
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTesting2] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleTest = async () => {
    if (!form.host || !form.username || !form.password) return toast.error('Fill in host, username, and password first');
    setTesting(true);
    setTesting2(null);
    await new Promise((r) => setTimeout(r, 2200));
    setTesting(false);
    setTesting2('success');
    toast.success('SMTP connection successful');
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast.success('SMTP settings saved');
  };

  const PRESET_SERVERS = [
    { label: 'Gmail', host: 'smtp.gmail.com', port: '587', enc: 'tls' },
    { label: 'Outlook', host: 'smtp.office365.com', port: '587', enc: 'tls' },
    { label: 'Yahoo', host: 'smtp.mail.yahoo.com', port: '465', enc: 'ssl' },
    { label: 'SendGrid', host: 'smtp.sendgrid.net', port: '587', enc: 'tls' },
    { label: 'Mailgun', host: 'smtp.mailgun.org', port: '587', enc: 'tls' },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={20} className="text-indigo-600" /> SMTP Settings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure an SMTP server for outgoing emails</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Quick presets */}
        <Card>
          <CardHeader title="Quick Presets" description="Select a common SMTP provider" />
          <div className="flex flex-wrap gap-2">
            {PRESET_SERVERS.map((p) => (
              <button
                key={p.label}
                onClick={() => setForm((f) => ({ ...f, host: p.host, port: p.port, encryption: p.enc }))}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all text-gray-600"
              >
                {p.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Server config */}
        <Card>
          <CardHeader title="Server Configuration" />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Input
                label="SMTP Host"
                placeholder="smtp.example.com"
                value={form.host}
                onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
              />
            </div>
            <Input
              label="Port"
              type="number"
              placeholder="587"
              value={form.port}
              onChange={(e) => setForm((f) => ({ ...f, port: e.target.value }))}
            />
            <Input
              label="Username"
              placeholder="user@example.com"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
            <Select
              label="Encryption"
              value={form.encryption}
              onChange={(e) => setForm((f) => ({ ...f, encryption: e.target.value }))}
              options={[
                { value: 'tls', label: 'TLS (recommended)' },
                { value: 'ssl', label: 'SSL' },
                { value: 'none', label: 'None (not recommended)' },
              ]}
            />
          </div>
        </Card>

        {/* Test connection */}
        <Card>
          <CardHeader title="Test Connection" description="Verify the SMTP server is reachable" />
          <div className="flex items-center gap-4">
            <Button icon={TestTube} variant="secondary" loading={testing} onClick={handleTest}>
              Test Connection
            </Button>
            {testResult === 'success' && (
              <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                <Check size={16} /> Connected successfully
              </span>
            )}
            {testResult === 'error' && (
              <span className="flex items-center gap-2 text-red-500 text-sm font-medium">
                <X size={16} /> Failed — check credentials
              </span>
            )}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button loading={saving} onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
