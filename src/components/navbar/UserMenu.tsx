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
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 border-primary/10 shadow-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-bold leading-none">{currentUser?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/5" />
        <div className="p-1">
          <DropdownMenuItem className="rounded-xl cursor-pointer p-2 focus:bg-primary/10 focus:text-primary transition-colors" asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {userRole === 'lab_owner' ? (
            <DropdownMenuItem className="rounded-xl cursor-pointer p-2 focus:bg-primary/10 focus:text-primary transition-colors" asChild>
              <Link to="/lab-dashboard" className="flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Lab Dashboard</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="rounded-xl cursor-pointer p-2 focus:bg-primary/10 focus:text-primary transition-colors" asChild>
              <Link to="/orders" className="flex items-center">
                <HeartPulse className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="rounded-xl cursor-pointer p-2 focus:bg-primary/10 focus:text-primary transition-colors" asChild>
            <Link to="/profile?tab=security" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="bg-primary/5" />
        <div className="p-1">
          <DropdownMenuItem 
            className="rounded-xl cursor-pointer p-2 text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
