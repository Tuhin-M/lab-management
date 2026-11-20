import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Search,
  Plus,
  Trash2,
  Pencil,
  Filter,
  Building2,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { AdminMasterTest, adminService } from '@/services/adminService';
import { toast } from 'sonner';

export const AdminTestCatalog: React.FC = () => {
  const [tests, setTests] = useState<AdminMasterTest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [editingTest, setEditingTest] = useState<Partial<AdminMasterTest> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const CATEGORIES = [
    'Hematology',
    'Biochemistry',
    'Immunology',
    'Microbiology',
    'Pathology',
    'Endocrinology',
    'Radiology',
    'Cardiology',
    'Genetics',
    'Hormones',
    'Toxicology',
    'Other',
  ];

  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getMasterTests({
        search,
        category: categoryFilter,
        page,
        pageSize: 15,
      });
      setTests(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load master tests:', err);
      toast.error('Failed to load master tests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTests();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, page]);

  const totalPages = Math.ceil(total / 15) || 1;

  const handleSaveTest = async () => {
    if (!editingTest?.name || !editingTest?.category) {
      toast.error('Test Name and Category are required');
      return;
    }

    try {
      setIsSaving(true);
      if (editingTest.id) {
        await adminService.updateMasterTest(editingTest.id, {
          name: editingTest.name,
          category: editingTest.category,
          sample_type: editingTest.sample_type || 'Blood',
          market_price: Number(editingTest.market_price) || 0,
          description: editingTest.description,
        });
        toast.success(`Updated "${editingTest.name}"`);
      } else {
        await adminService.createMasterTest({
          name: editingTest.name,
          category: editingTest.category,
          sample_type: editingTest.sample_type || 'Blood',
          market_price: Number(editingTest.market_price) || 0,
          description: editingTest.description,
        });
        toast.success(`Added "${editingTest.name}" to master catalog`);
      }
      setIsModalOpen(false);
      fetchTests();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save test');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (test: AdminMasterTest) => {
    if (!window.confirm(`Permanently remove "${test.name}" from the global catalog?`)) return;
    try {
      setDeletingId(test.id);
      await adminService.deleteMasterTest(test.id);
      toast.success(`Removed "${test.name}"`);
      fetchTests();
    } catch {
      toast.error('Failed to delete master test');
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search catalog by test name..."
            className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48 h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold">
              <Filter size={13} className="mr-1.5 text-slate-400" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => {
              setEditingTest({
                name: '',
                category: 'Biochemistry',
                sample_type: 'Blood',
                market_price: 500,
                description: '',
              });
              setIsModalOpen(true);
            }}
            className="h-10 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
          >
            <Plus size={15} /> Add Master Test
          </Button>
        </div>
      </div>

      {/* Tests Table */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-xs">
              <TableHead className="font-bold text-slate-700">Test Definition</TableHead>
              <TableHead className="font-bold text-slate-700">Category</TableHead>
              <TableHead className="font-bold text-slate-700">Sample Type</TableHead>
              <TableHead className="font-bold text-slate-700">Market Price</TableHead>
              <TableHead className="font-bold text-slate-700">Offered In</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs italic">
                  Loading catalog definitions...
                </TableCell>
              </TableRow>
            ) : tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs italic">
                  No tests found matching search criteria.
                </TableCell>
              </TableRow>
            ) : (
              tests.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-bold text-slate-900">{t.name}</p>
                      {t.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-sm">
                          {t.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-semibold">
                      {t.category || 'General'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {t.sample_type || 'Blood'}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-slate-900">₹{(t.market_price || 0).toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-teal-50 text-teal-700 border-teal-200 font-bold gap-1 text-[11px]">
                      <Building2 size={11} /> {t.lab_count || 0} labs
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingTest(t);
                          setIsModalOpen(true);
                        }}
                        className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-900"
                        title="Edit Master Test"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(t)}
                        disabled={deletingId === t.id}
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Test"
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

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{(page - 1) * 15 + 1}</strong> to{' '}
            <strong>{Math.min(page * 15, total)}</strong> of <strong>{total}</strong> tests
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 rounded-lg text-xs"
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            <span className="font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 rounded-lg text-xs"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Add / Edit Test Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingTest?.id ? 'Edit Master Test' : 'Add Master Test Definition'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Global test definitions can be offered and priced by all laboratories.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Test Name *</label>
              <Input
                value={editingTest?.name || ''}
                onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                placeholder="e.g. Complete Blood Count (CBC)"
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Department / Category *</label>
                <Select
                  value={editingTest?.category || 'Biochemistry'}
                  onValueChange={(val) => setEditingTest({ ...editingTest, category: val })}
                >
                  <SelectTrigger className="h-9 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sample Specimen</label>
                <Input
                  value={editingTest?.sample_type || 'Blood'}
                  onChange={(e) => setEditingTest({ ...editingTest, sample_type: e.target.value })}
                  placeholder="Blood, Urine, Saliva..."
                  className="h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Benchmark Market Price (₹)</label>
              <Input
                type="number"
                value={editingTest?.market_price || 0}
                onChange={(e) => setEditingTest({ ...editingTest, market_price: Number(e.target.value) })}
                className="h-9 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Description</label>
              <Textarea
                value={editingTest?.description || ''}
                onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })}
                placeholder="Diagnostic clinical description and test purpose..."
                className="rounded-xl min-h-[80px] resize-none"
              />
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
              onClick={handleSaveTest}
              disabled={isSaving}
              className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSaving ? 'Saving...' : 'Save Definition'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
