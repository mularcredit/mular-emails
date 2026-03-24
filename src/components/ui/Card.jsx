import clsx from 'clsx';

export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-100 shadow-sm',
        hover && 'hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, actions, className = '' }) {
  return (
    <div className={clsx('flex items-start justify-between gap-4 mb-5', className)}>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
