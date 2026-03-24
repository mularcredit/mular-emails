import clsx from 'clsx';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
  xl: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={14} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={14} />}
    </button>
  );
}
