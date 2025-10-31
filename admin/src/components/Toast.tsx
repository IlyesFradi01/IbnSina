'use client';

import * as React from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type ToastVariant = 'default' | 'destructive';

type ToastPosition = 'top' | 'bottom';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const ToastViewport: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cx(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] pointer-events-none',
        className
      )}
      {...props}
    />
  );
};

type ToastProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ToastVariant;
  position?: ToastPosition;
  className?: string;
  children?: React.ReactNode;
};

export const Toast: React.FC<ToastProps> = ({ open = true, onOpenChange, variant = 'default', position = 'bottom', className, children }) => {
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  if (!open && !mounted) return null;

  const handleClose = () => {
    // start exit animation then signal close
    setClosing(true);
    setTimeout(() => {
      setMounted(false);
      setClosing(false);
      onOpenChange?.(false);
    }, 100);
  };

  const posClass = position === 'top' ? 'fixed right-6 top-6' : 'fixed right-6 bottom-6';

  const isError = variant === 'destructive';
  const accentColor = isError ? 'bg-red-500' : 'bg-green-500';
  const borderColor = isError ? 'border-red-200' : 'border-gray-200';
  const bgColor = isError ? 'bg-red-50' : 'bg-white';
  const textColor = isError ? 'text-red-900' : 'text-gray-900';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        'pointer-events-auto z-[101] flex w-[380px] items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-all duration-500 ease-out',
        posClass,
        borderColor,
        bgColor,
        textColor,
        // horizontal translate animation (slower and longer distance)
        !closing ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10',
        mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10',
        className
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className={cx('h-10 w-1 rounded-full mt-0.5', accentColor)} />

      <div className="mt-0.5">
        {isError ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-red-600"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-7.18 12.5A2 2 0 005 20h14a2 2 0 001.73-3.64l-7.18-12.5a2 2 0 00-3.46 0z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-green-600"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        )}
      </div>

      <div className="flex-1">
        {children}
      </div>

      <button
        type="button"
        aria-label="Close"
        className={cx(
          'ml-2 rounded-md p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300',
          isError && 'text-red-600 hover:text-red-700 focus:ring-red-300'
        )}
        onClick={handleClose}
      >
        <span aria-hidden>×</span>
      </button>
    </div>
  );
};

export const ToastTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cx('text-sm font-semibold', className)} {...props} />
);

export const ToastDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cx('text-sm opacity-90', className)} {...props} />
);
