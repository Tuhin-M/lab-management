import React from 'react';
import { Search, RefreshCw, Bell, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  isRefreshing = false,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search across platform...',
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
      <div>
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onSearchChange !== undefined && (
          <div className="relative w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <Input
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-9 text-xs rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 rounded-xl border-slate-200 gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-teal-600' : ''} />
          <span>Refresh</span>
        </Button>
      </div>
    </header>
  );
};
