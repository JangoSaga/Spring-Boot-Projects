import React from 'react';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';

// 1. Loading Skeleton Component
export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-lg w-1/4"></div>
      <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-5 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4.5 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Full Page Loader Spinner
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <span className="text-xs font-semibold text-slate-400">{message}</span>
    </div>
  );
};

// 3. Reusable Empty State
interface EmptyStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-sm mx-auto space-y-4 border border-dashed border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-400">
        <Inbox className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
};

// 4. Reusable Error State
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-sm mx-auto space-y-4 border border-red-100 rounded-xl bg-red-50/50">
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-red-600 font-medium leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};
