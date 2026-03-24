import clsx from 'clsx';

const variants = {
  sent: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  opened: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  clicked: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  deferred: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  default: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  brevo: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  smtp: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  connected: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  disconnected: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const key = (children?.toString()?.toLowerCase() || variant);
  const style = variants[key] || variants[variant] || variants.default;
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        style,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      {children}
    </span>
  );
}
