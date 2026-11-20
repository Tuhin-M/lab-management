import React, { useState } from 'react';
import {
  Building2,
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  FlaskConical,
  Trash2,
  Filter,
  Eye,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import { AdminLab, adminService } from '@/services/adminService';
import { toast } from 'sonner';

interface AdminLabsProps {
  labs: AdminLab[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const AdminLabs: React.FC<AdminLabsProps> = ({ labs, onRefresh, isLoading }) => {
  const [search, setSearch] = useState('');
  const [accreditedFilter, setAccreditedFilter] = useState('all');
  const [selectedLab, setSelectedLab] = useState<AdminLab | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filteredLabs = labs.filter((l) => {
    const matchesAccredited =
      accreditedFilter === 'all'
        ? true
        : accreditedFilter === 'accredited'
        ? l.accredited
        : !l.accredited;

    const matchesSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.address_city && l.address_city.toLowerCase().includes(search.toLowerCase())) ||
      (l.address_state && l.address_state.toLowerCase().includes(search.toLowerCase()));

    return matchesAccredited && matchesSearch;
  });

  const handleToggleAccreditation = async (lab: AdminLab) => {
    try {
      setTogglingId(lab.id);
      const next = await adminService.toggleLabAccreditation(lab.id, lab.accredited);
      toast.success(`${lab.name} marked as ${next ? 'Accredited' : 'Standard'}`);
      onRefresh();
    } catch (err: any) {
      toast.error('Failed to update accreditation');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteLab = async (lab: AdminLab) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${lab.name}"? This removes its catalog listings.`)) {
      return;
    }

    try {
      setDeletingId(lab.id);
      await adminService.deleteLab(lab.id);
      toast.success(`Lab "${lab.name}" deleted successfully`);
      onRefresh();
    } catch (err: any) {
      toast.error('Failed to delete laboratory');
    } finally {
      setDeletingId(null);
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
            placeholder="Search labs by name, city, or state..."
            className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={accreditedFilter} onValueChange={setAccreditedFilter}>
            <SelectTrigger className="w-48 h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold">
              <Filter size={13} className="mr-1.5 text-slate-400" />
              <SelectValue placeholder="All Labs" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Laboratories</SelectItem>
              <SelectItem value="accredited">Accredited Only</SelectItem>
              <SelectItem value="standard">Standard Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Labs Table */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-xs">
              <TableHead className="font-bold text-slate-700">Laboratory</TableHead>
              <TableHead className="font-bold text-slate-700">Location</TableHead>
              <TableHead className="font-bold text-slate-700">Contact</TableHead>
              <TableHead className="font-bold text-slate-700">Menu Size</TableHead>
              <TableHead className="font-bold text-slate-700">Accreditation</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs italic">
                  Loading laboratories...
                </TableCell>
              </TableRow>
            ) : filteredLabs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs italic">
                  No laboratories found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredLabs.map((l) => (
                <TableRow key={l.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{l.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {l.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span>{l.address_city || 'City N/A'}, {l.address_state || 'State N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-slate-800">{l.phone || '—'}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{l.email || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 font-bold border-slate-200">
                      <FlaskConical size={11} className="mr-1 text-teal-600" />
                      {l.test_count || 0} tests
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {l.accredited ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold gap-1">
                        <ShieldCheck size={12} /> Accredited
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-500 border-slate-200">
                        Standard
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant={l.accredited ? 'outline' : 'default'}
                        onClick={() => handleToggleAccreditation(l)}
                        disabled={togglingId === l.id}
                        className={`h-8 rounded-lg text-xs font-semibold ${
                          !l.accredited ? 'bg-teal-600 hover:bg-teal-700 text-white' : ''
                        }`}
                      >
                        {l.accredited ? 'Revoke' : 'Accredit'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedLab(l);
                          setIsDetailModalOpen(true);
                        }}
                        className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-900"
                        title="View lab details"
                      >
                        <Eye size={14} />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteLab(l)}
                        disabled={deletingId === l.id}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete laboratory"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Lab Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Building2 size={18} className="text-teal-600" />
              {selectedLab?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Laboratory profile and metadata summary.
            </DialogDescription>
          </DialogHeader>

          {selectedLab && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lab ID:</span>
                  <span className="font-mono text-slate-800">{selectedLab.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {selectedLab.address_street || ''} {selectedLab.address_city}, {selectedLab.address_state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-medium text-slate-800">{selectedLab.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-medium text-slate-800">{selectedLab.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Offered Tests:</span>
                  <span className="font-bold text-teal-700">{selectedLab.test_count || 0} tests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Accredited:</span>
                  <span className="font-bold text-slate-800">{selectedLab.accredited ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDetailModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
