import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authAPI } from '@/services/api';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor-dashboard' },
  { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
  { icon: Settings, label: 'Settings', path: '/doctor/settings' },
];

interface DoctorSidebarProps {
  activeTab?: string;
}

const DoctorSidebar: React.FC<DoctorSidebarProps> = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-80px)] sticky top-20 z-20">
      <div className="flex-1 py-6 px-4 space-y-2">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-3">
              <link.icon size={20} className={cn(
                "transition-colors",
                "group-hover:text-primary",
                "group-[.active]:text-white"
              )} />
              <span className="font-medium">{link.label}</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => authAPI.logout()}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
