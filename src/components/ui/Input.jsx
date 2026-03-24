import clsx from 'clsx';
import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900',
            'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            'transition-all duration-150',
            Icon && 'pl-10',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export function Textarea({ label, error, className = '', rows = 4, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        rows={rows}
        className={clsx(
          'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900',
          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          'transition-all duration-150 resize-none',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, className = '', options = [], ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={clsx(
          'w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          'transition-all duration-150',
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
