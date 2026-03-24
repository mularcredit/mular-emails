import { useState, useEffect } from 'react';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { Zap, Check, X, AlertTriangle, Eye, EyeOff, TestTube, Plus } from 'lucide-react';

export default function BrevoSettingsPage() {
  const [form, setForm] = useState({
    apiKey: import.meta.env.VITE_BREVO_API_KEY,
    senderEmail: 'a5d4bf001@smtp-brevo.com',
    senderName: 'Mular Platform',
  });
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saving, setSaving] = useState(false);

  // Senders state
  const [senders, setSenders] = useState([]);
  const [loadingSenders, setLoadingSenders] = useState(false);
  const [newSenderName, setNewSenderName] = useState('');
  const [newSenderEmail, setNewSenderEmail] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchSenders();
  }, [form.apiKey]);

  const fetchSenders = async () => {
    if (!form.apiKey) return;
    setLoadingSenders(true);
    try {
      const res = await fetch('https://api.brevo.com/v3/senders', {
        headers: { 'api-key': form.apiKey, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setSenders(data.senders || []);
      }
    } catch (e) {
      console.error('Failed to fetch senders', e);
    }
    setLoadingSenders(false);
  };

  const handleRegisterSender = async () => {
    if (!newSenderName || !newSenderEmail) return toast.error('Name and Email required');
    if (!newSenderEmail.toLowerCase().endsWith('@mularcredit.co.ke')) {
      return toast.error('Only @mularcredit.co.ke emails are allowed');
    }
    setRegistering(true);
    try {
      const res = await fetch('https://api.brevo.com/v3/senders', {
        method: 'POST',
        headers: { 'api-key': form.apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: newSenderName, email: newSenderEmail })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to register sender');
      }
      toast.success('Sender registered! Please check email to verify.');
      setNewSenderName('');
      setNewSenderEmail('');
      fetchSenders();
    } catch (e) {
      toast.error(e.message);
    }
    setRegistering(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('https://api.brevo.com/v3/account', {
        headers: { 'api-key': form.apiKey, 'Accept': 'application/json' }
      });
      setTesting(false);
      if (res.ok) {
        setTestResult('success');
        toast.success('Connection successful — Brevo API key is valid');
      } else {
        setTestResult('error');
        toast.error('Invalid Brevo API key');
      }
    } catch (e) {
      setTesting(false);
      setTestResult('error');
      toast.error('Connection failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast.success('Brevo settings saved');
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Sender Profiles
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your verified sender addresses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <div className="flex flex-col gap-5">
          {/* Sender Settings Identity */}
          <Card>
            <CardHeader title="Default Sender Identity" description="Default sender for quick composing" />
            <div className="grid gap-4">
              <Input
                label="Sender Email"
                type="email"
                value={form.senderEmail}
                onChange={(e) => setForm((f) => ({ ...f, senderEmail: e.target.value }))}
                placeholder="noreply@company.com"
              />
              <Input
                label="Sender Name"
                value={form.senderName}
                onChange={(e) => setForm((f) => ({ ...f, senderName: e.target.value }))}
                placeholder="Your Company"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button loading={saving} onClick={handleSave}>Save Settings</Button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* Registered Senders */}
          <Card>
            <CardHeader title="Registered Senders" description="Manage verified sender identities for your Brevo account" />
            <div className="space-y-4">
              {loadingSenders ? (
                <div className="py-8 text-center border border-gray-100 rounded-lg bg-gray-50/50">
                  <div className="inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-gray-500">Loading senders...</p>
                </div>
              ) : senders.length > 0 ? (
                <div className="border border-gray-100 rounded-lg overflow-hidden flex flex-col max-h-[300px]">
                  <div className="overflow-y-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 font-medium">Name / Email</th>
                          <th className="px-4 py-3 font-medium w-24">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {senders.map(s => (
                          <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">{s.name}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{s.email}</p>
                            </td>
                            <td className="px-4 py-3">
                              {s.active ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded-full border border-emerald-200/50">
                                  <Check size={12} strokeWidth={2.5} /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-1 rounded-full border border-amber-200/50">
                                  <AlertTriangle size={12} strokeWidth={2.5} /> Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">No senders found</p>
                  <p className="text-xs text-gray-500 mt-1">Please check your API key or add a new sender.</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                  <Plus size={16} className="text-indigo-600" /> Register New Sender
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input 
                        label="Sender Name" 
                        placeholder="e.g. Sales Team" 
                        value={newSenderName} 
                        onChange={e => setNewSenderName(e.target.value)} 
                      />
                    </div>
                    <div className="flex-1">
                      <Input 
                        label="Sender Email" 
                        type="email"
                        placeholder="e.g. sales@company.com" 
                        value={newSenderEmail} 
                        onChange={e => setNewSenderEmail(e.target.value)} 
                      />
                    </div>
                  </div>
                  <Button loading={registering} onClick={handleRegisterSender} className="w-full justify-center">
                    Register Sender with Brevo
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
