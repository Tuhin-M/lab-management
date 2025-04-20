import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  currentUser: any;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, onLogout }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{currentUser?.name}</span>
      <Button variant="outline" size="sm" onClick={onLogout} title="Logout">
        <LogOut className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default UserMenu;
