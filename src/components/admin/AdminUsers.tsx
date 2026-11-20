import React, { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminUser, adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AdminUsersProps {
  users: AdminUser[];
  onRefresh: () => void;
  isLoading?: boolean;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
  admin: { label: 'Admin', color: 'text-red-700 bg-red-50 border-red-200', badge: 'bg-red-500' },
  lab_owner: { label: 'Lab Owner', color: 'text-teal-700 bg-teal-50 border-teal-200', badge: 'bg-teal-500' },
  doctor: { label: 'Doctor', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', badge: 'bg-indigo-500' },
  user: { label: 'Patient', color: 'text-blue-700 bg-blue-50 border-blue-200', badge: 'bg-blue-500' },
};

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onRefresh, isLoading }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    return matchesRole && matchesSearch;
  });

  const handleOpenRoleModal = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser || !newRole) return;
    try {
      setIsUpdating(true);
      await adminService.updateUserRole(selectedUser.id, newRole);
      toast.success(`Role for ${selectedUser.name} updated to ${newRole}`);
      setIsRoleModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error('Role update error:', err);
      toast.error(err?.message || 'Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or phone..."
            className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-44 h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold">
              <Filter size={13} className="mr-1.5 text-slate-400" />
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Patients</SelectItem>
              <SelectItem value="lab_owner">Lab Owners</SelectItem>
              <SelectItem value="doctor">Doctors</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-xs">
              <TableHead className="font-bold text-slate-700">User</TableHead>
              <TableHead className="font-bold text-slate-700">Contact</TableHead>
              <TableHead className="font-bold text-slate-700">Current Role</TableHead>
              <TableHead className="font-bold text-slate-700">Registered</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-xs italic">
                  Loading users catalog...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-xs italic">
                  No users matched your query.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const conf = ROLE_CONFIG[u.role] || ROLE_CONFIG.user;
                return (
                  <TableRow key={u.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase border border-slate-200">
                          {(u.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-slate-800 font-medium">{u.email}</p>
                      {u.phone && <p className="text-[11px] text-slate-500 mt-0.5">{u.phone}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${conf.color} font-bold text-[11px] rounded-lg px-2 py-0.5`}>
                        {conf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {u.created_at ? format(new Date(u.created_at), 'dd MMM yyyy') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenRoleModal(u)}
                        className="h-8 rounded-lg text-xs font-semibold gap-1.5"
                      >
                        <UserCheck size={13} />
                        Change Role
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Role Management Dialog */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Change User Role</DialogTitle>
            <DialogDescription className="text-xs">
              Update authorization level for <strong className="text-slate-900">{selectedUser?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select New Role</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="rounded-xl text-xs h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="user">Patient (Standard User)</SelectItem>
                  <SelectItem value="lab_owner">Lab Owner</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Platform Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              Changing role to <strong>{newRole}</strong> grants respective portal permissions and dashboard access immediately.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRoleModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveRole}
              disabled={isUpdating}
              className="rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isUpdating ? 'Saving...' : 'Apply Role Change'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
