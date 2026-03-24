import { useState } from 'react';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserCircle, Lock, Bell, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast.success('Profile updated');
  };

  const handlePw = async () => {
    if (!pw.current || !pw.next) return toast.error('Fill in all password fields');
    if (pw.next !== pw.confirm) return toast.error('Passwords do not match');
    if (pw.next.length < 8) return toast.error('Password must be at least 8 characters');
    setPwSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setPwSaving(false);
    setPw({ current: '', next: '', confirm: '' });
    toast.success('Password changed successfully');
  };

  const [notifications, setNotifications] = useState({
    deliveries: true,
    failures: true,
    weekly: false,
  });

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Avatar + name */}
        <Card>
          <CardHeader title="Account Info" />
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <span className="text-xl font-bold text-indigo-700">{initials}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{profile.name}</p>
              <p className="text-sm text-gray-400">{profile.email}</p>
              <span className="mt-1 inline-flex text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">Admin</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button loading={saving} onClick={handleSave} size="sm">Save Profile</Button>
          </div>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader title="Change Password" description="Use a strong, unique password" />
          <div className="flex flex-col gap-3">
            <Input label="Current Password" type="password" placeholder="••••••••" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
            <Input label="New Password" type="password" placeholder="At least 8 characters" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
            <Input label="Confirm New Password" type="password" placeholder="Repeat new password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="secondary" icon={Lock} loading={pwSaving} onClick={handlePw} size="sm">Update Password</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader title="Notifications" description="Choose what events to be notified about" />
          <div className="space-y-3">
            {[
              { key: 'deliveries', label: 'Email delivery confirmations', desc: 'Get notified when emails are delivered' },
              { key: 'failures', label: 'Delivery failures', desc: 'Alert when an email bounces or fails' },
              { key: 'weekly', label: 'Weekly summary report', desc: 'Receive a digest every Monday morning' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${notifications[key] ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  style={{ height: '22px', width: '40px' }}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${notifications[key] ? 'translate-x-[18px]' : 'translate-x-0'}`}
                    style={{ width: '18px', height: '18px' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader title="Security" />
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast.success('2FA setup coming soon')}>Enable</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
