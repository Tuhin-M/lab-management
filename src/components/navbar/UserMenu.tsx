import React from "react";
import { LogOut, User, Settings, LayoutDashboard, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";

interface UserMenuProps {
  currentUser: any;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const userRole = authAPI.getCurrentUserRole();
  const initials = currentUser?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/10 hover:border-primary/30 p-0 overflow-hidden ring-offset-background transition-all hover:scale-105 active:scale-95 group">
          <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20 transition-all">
            <AvatarImage src={currentUser?.user_metadata?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.email}`} alt={currentUser?.user_metadata?.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 mt-3 rounded-[28px] p-2 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 shadow-[0_25px_70px_rgba(0,0,0,0.2)] ring-0 animate-in fade-in zoom-in-95 duration-200" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="px-5 pt-4 pb-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">{currentUser?.name}</p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 mb-1" />
        
        <div className="p-1 space-y-1">
          <DropdownMenuItem 
            className="rounded-[20px] cursor-pointer p-3 focus:bg-primary/10 focus:text-primary transition-all duration-300 group" 
            asChild
          >
            <Link to="/profile" className="flex items-center">
              <div className="bg-blue-50 dark:bg-blue-900/40 p-2.5 rounded-xl mr-4 group-hover:scale-110 transition-all duration-300">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-semibold text-[15px]">My Profile</span>
            </Link>
          </DropdownMenuItem>
          
          {userRole === 'lab_owner' ? (
            <DropdownMenuItem 
              className="rounded-[20px] cursor-pointer p-3 focus:bg-primary/10 focus:text-primary transition-all duration-300 group" 
              asChild
            >
              <Link to="/lab-dashboard" className="flex items-center">
                <div className="bg-teal-50 dark:bg-teal-900/40 p-2.5 rounded-xl mr-4 group-hover:scale-110 transition-all duration-300">
                  <LayoutDashboard className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="font-semibold text-[15px]">Lab Dashboard</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              className="rounded-[20px] cursor-pointer p-3 focus:bg-primary/10 focus:text-primary transition-all duration-300 group" 
              asChild
            >
              <Link to="/orders" className="flex items-center">
                <div className="bg-rose-50 dark:bg-rose-900/40 p-2.5 rounded-xl mr-4 group-hover:scale-110 transition-all duration-300">
                  <HeartPulse className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="font-semibold text-[15px]">My Orders</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="rounded-[20px] cursor-pointer p-3 focus:bg-primary/10 focus:text-primary transition-all duration-300 group" 
            asChild
          >
            <Link to="/settings" className="flex items-center">
              <div className="bg-amber-50 dark:bg-amber-900/40 p-2.5 rounded-xl mr-4 group-hover:scale-110 transition-all duration-300">
                <Settings className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-semibold text-[15px]">Platform Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>
        
        <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 my-2" />
        
        <div className="p-1">
          <DropdownMenuItem 
            className="rounded-[20px] cursor-pointer p-3 text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-700 transition-all duration-300 group"
            onClick={onLogout}
          >
            <div className="bg-red-50 dark:bg-red-900/30 p-2.5 rounded-xl mr-4 group-hover:scale-110 transition-all duration-300">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="font-bold text-[15px]">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
