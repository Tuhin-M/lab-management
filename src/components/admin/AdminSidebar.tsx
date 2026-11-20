import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  FlaskConical,
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'labs'
  | 'doctors'
  | 'tests'
  | 'bookings'
  | 'appointments'
  | 'reviews'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts?: {
    users?: number;
    labs?: number;
    doctors?: number;
    tests?: number;
    bookings?: number;
    appointments?: number;
    reviews?: number;
  };
  currentUser?: any;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  counts,
  currentUser,
  onLogout,
}) => {
  const navigate = useNavigate();

  const navigationItems: {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
    category?: string;
  }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} />, count: counts?.users },
    { id: 'labs', label: 'Laboratories', icon: <Building2 size={18} />, count: counts?.labs },
    { id: 'doctors', label: 'Doctors', icon: <Stethoscope size={18} />, count: counts?.doctors },
    { id: 'tests', label: 'Master Tests', icon: <FlaskConical size={18} />, count: counts?.tests },
    { id: 'bookings', label: 'Lab Bookings', icon: <ClipboardList size={18} />, count: counts?.bookings },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={18} />, count: counts?.appointments },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18} />, count: counts?.reviews },
    { id: 'settings', label: 'Platform Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand & Admin Badge */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-teal-500/20">
            E
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">Ekitsa</span>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-[10px] px-1.5 py-0 h-4">
                Admin
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">Master Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Management
        </p>

        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {typeof item.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Account section */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-400 border border-slate-700 flex items-center justify-center font-bold text-xs">
            {(currentUser?.name?.[0] || 'A').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Super Admin'}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'admin@ekitsa.com'}</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="w-full justify-start text-xs text-slate-400 hover:text-white hover:bg-slate-800 h-8 rounded-lg gap-2"
          >
            <ArrowLeft size={14} /> Back to Customer Portal
          </Button>
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 rounded-lg gap-2"
            >
              <LogOut size={14} /> Sign Out
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
