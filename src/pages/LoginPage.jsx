import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/compose');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fc]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-indigo-600 p-12 overflow-hidden relative">
        {/* Abstract background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full opacity-60" />
          <div className="absolute top-1/3 -right-16 w-72 h-72 bg-indigo-700 rounded-full opacity-50" />
          <div className="absolute bottom-16 left-1/3 w-48 h-48 bg-indigo-500 rounded-full opacity-40" />
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg p-1.5 shrink-0">
              <img src="/mular-logo.png" alt="Mular Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">Mular</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="flex flex-col gap-6">
            {/* Feature cards */}
            {[
              { icon: Zap, title: 'Lightning Fast Delivery', desc: 'Send transactional and marketing emails at scale with full control.' },
              { icon: Mail, title: 'Reliable Infrastructure', desc: 'Enterprise-grade architecture for flexible, guaranteed email delivery.' },
              { icon: ArrowRight, title: 'Actionable Insights', desc: 'Monitor open rates, clicks, and delivery status in real-time.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-white/70 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/50 text-xs">© 2026 Mular Email Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-10 h-10 shrink-0">
            <img src="/mular-logo.png" alt="Mular Logo" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
          <span className="font-bold text-gray-900 text-2xl tracking-tight">Mular</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500 mt-1">Access your email platform dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} iconRight={ArrowRight} size="lg" className="w-full mt-2 justify-center">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 border border-gray-100 rounded-lg text-center">
            <p className="text-xs text-gray-500">Demo: use any email + password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
