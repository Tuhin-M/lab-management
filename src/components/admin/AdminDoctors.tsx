import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  CheckCircle2,
  Star,
  MapPin,
  Trash2,
  Plus,
  Filter,
  Pencil,
  Sparkles,
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
import { AdminDoctor, adminService } from '@/services/adminService';
import { toast } from 'sonner';

interface AdminDoctorsProps {
  doctors: AdminDoctor[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const AdminDoctors: React.FC<AdminDoctorsProps> = ({ doctors, onRefresh, isLoading }) => {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [editingDoctor, setEditingDoctor] = useState<Partial<AdminDoctor> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean)));

  const filteredDoctors = doctors.filter((d) => {
    const matchesSpec = specialtyFilter === 'all' || d.specialty === specialtyFilter;
    const matchesSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      (d.city && d.city.toLowerCase().includes(search.toLowerCase()));
    return matchesSpec && matchesSearch;
  });

  const handleToggleVerify = async (doc: AdminDoctor) => {
    try {
      const next = await adminService.toggleDoctorVerification(doc.id, doc.verified);
      toast.success(`${doc.name} ${next ? 'verified' : 'unverified'}`);
      onRefresh();
    } catch {
      toast.error('Failed to update verification status');
    }
  };

  const handleToggleFeatured = async (doc: AdminDoctor) => {
    try {
      const next = await adminService.toggleDoctorFeatured(doc.id, Boolean(doc.featured));
      toast.success(`${doc.name} ${next ? 'marked as Featured' : 'removed from Featured'}`);
      onRefresh();
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const handleDeleteDoctor = async (doc: AdminDoctor) => {
    if (!window.confirm(`Are you sure you want to remove ${doc.name}?`)) return;
    try {
      await adminService.deleteDoctor(doc.id);
      toast.success(`${doc.name} removed successfully`);
      onRefresh();
    } catch {
      toast.error('Failed to remove doctor');
    }
  };

  const handleSaveDoctor = async () => {
    if (!editingDoctor?.name || !editingDoctor?.specialty) {
      toast.error('Name and Specialty are required');
      return;
    }

    try {
      setIsSaving(true);
      await adminService.saveDoctor({
        ...editingDoctor,
        fee: Number(editingDoctor.fee) || 500,
        experience: Number(editingDoctor.experience) || 5,
      });
      toast.success('Doctor details saved successfully');
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save doctor');
    } finally {
      setIsSaving(false);
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
            placeholder="Search doctors by name, specialty, or city..."
            className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-48 h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold">
              <Filter size={13} className="mr-1.5 text-slate-400" />
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => {
              setEditingDoctor({
                name: '',
                specialty: 'General Physician',
                experience: 5,
                fee: 500,
                city: 'Bengaluru',
                hospital: 'Ekitsa Virtual Clinic',
                verified: true,
              });
              setIsModalOpen(true);
            }}
            className="h-10 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
          >
            <Plus size={15} /> Add Doctor
          </Button>
        </div>
      </div>

      {/* Doctors Table */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-xs">
              <TableHead className="font-bold text-slate-700">Doctor</TableHead>
              <TableHead className="font-bold text-slate-700">Specialty</TableHead>
              <TableHead className="font-bold text-slate-700">Hospital / City</TableHead>
              <TableHead className="font-bold text-slate-700">Fee</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs italic">
                  Loading medical practitioners...
                </TableCell>
              </TableRow>
            ) : filteredDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs italic">
                  No doctors found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredDoctors.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Stethoscope size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.qualifications || 'MBBS'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-50/60 text-indigo-700 border-indigo-200 font-semibold">
                      {doc.specialty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-slate-800 font-medium">{doc.hospital || 'Ekitsa Clinic'}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doc.city || 'Online'}</p>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-slate-900">₹{(doc.fee || 0).toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={
                          doc.verified
                            ? 'bg-green-50 text-green-700 border-green-200 font-semibold'
                            : 'text-slate-400 border-slate-200'
                        }
                      >
                        {doc.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                      {doc.featured && (
                        <Badge className="bg-amber-500 text-white text-[10px] px-1 py-0 h-4">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant={doc.verified ? 'outline' : 'default'}
                        onClick={() => handleToggleVerify(doc)}
                        className={`h-8 rounded-lg text-xs font-semibold ${
                          !doc.verified ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''
                        }`}
                      >
                        {doc.verified ? 'Unverify' : 'Verify'}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleFeatured(doc)}
                        className="h-8 w-8 p-0 rounded-lg text-amber-600 hover:bg-amber-50"
                        title={doc.featured ? 'Remove Featured' : 'Mark as Featured'}
                      >
                        <Sparkles size={14} className={doc.featured ? 'fill-amber-500' : ''} />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingDoctor(doc);
                          setIsModalOpen(true);
                        }}
                        className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-900"
                        title="Edit Doctor"
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDoctor(doc)}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Doctor"
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

      {/* Add / Edit Doctor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingDoctor?.id ? 'Edit Doctor Profile' : 'Add New Doctor'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure physician credentials and consultation fees.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name *</label>
              <Input
                value={editingDoctor?.name || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                placeholder="Dr. Rajesh Kumar"
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Specialty *</label>
                <Input
                  value={editingDoctor?.specialty || ''}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  placeholder="Cardiologist"
                  className="h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Qualifications</label>
                <Input
                  value={editingDoctor?.qualifications || ''}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, qualifications: e.target.value })}
                  placeholder="MBBS, MD"
                  className="h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Consultation Fee (₹)</label>
                <Input
                  type="number"
                  value={editingDoctor?.fee || 500}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, fee: Number(e.target.value) })}
                  className="h-9 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Experience (Years)</label>
                <Input
                  type="number"
                  value={editingDoctor?.experience || 5}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: Number(e.target.value) })}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Hospital / Affiliation</label>
                <Input
                  value={editingDoctor?.hospital || ''}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, hospital: e.target.value })}
                  placeholder="Apollo Hospital"
                  className="h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">City</label>
                <Input
                  value={editingDoctor?.city || ''}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, city: e.target.value })}
                  placeholder="Bengaluru"
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveDoctor}
              disabled={isSaving}
              className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSaving ? 'Saving...' : 'Save Doctor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
