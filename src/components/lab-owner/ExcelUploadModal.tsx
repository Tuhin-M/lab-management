import React, { useState, useRef, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Download,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Check,
  FlaskConical,
  Database,
  Tag,
  Clock,
  Droplet,
  Layers,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import {
  parsePriceListFile,
  loadBundledIQDxPriceList,
  downloadSamplePriceListTemplate,
  ParsedPriceListTest,
  ParseResult,
} from '@/utils/excelPriceListParser';
import { labOwnerAPI } from '@/services/api';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  labId: string;
  labName?: string;
  onSuccess?: () => void;
}

type Step = 'upload' | 'preview' | 'importing' | 'completed';

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  labId,
  labName = 'Laboratory',
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>('upload');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [tests, setTests] = useState<ParsedPriceListTest[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Configuration options
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [defaultTurnaround, setDefaultTurnaround] = useState<string>('24 hours');
  const [defaultDuration, setDefaultDuration] = useState<string>('15 mins');
  const [updateExisting, setUpdateExisting] = useState<boolean>(true);

  // Pagination for preview
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState<{
    phase: 'syncing_catalog' | 'mapping_lab' | 'completed';
    current: number;
    total: number;
    percentage: number;
    message: string;
  }>({
    phase: 'syncing_catalog',
    current: 0,
    total: 0,
    percentage: 0,
    message: 'Starting import...',
  });

  const [uploadStats, setUploadStats] = useState<{
    addedToLab: number;
    addedToCatalog: number;
    updatedInLab: number;
    totalProcessed: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Reset state on modal close/open
  const handleClose = () => {
    if (step === 'importing') {
      if (!window.confirm('Import is currently in progress. Are you sure you want to cancel?')) {
        return;
      }
    }
    setStep('upload');
    setFile(null);
    setParseResult(null);
    setTests([]);
    setSearchQuery('');
    setSelectedDept('ALL');
    onClose();
  };

  // Handle parsing result
  const handleParseSuccess = (result: ParseResult, sourceName?: string) => {
    setParseResult(result);
    setTests(result.tests);
    setStep('preview');
    setCurrentPage(1);
    toast.success(
      `Parsed ${result.tests.length} tests from ${sourceName || 'Excel file'}!`
    );
  };

  // File Drop / Selection handler
  const processFile = async (selectedFile: File) => {
    if (
      !selectedFile.name.endsWith('.xlsx') &&
      !selectedFile.name.endsWith('.xls') &&
      !selectedFile.name.endsWith('.csv')
    ) {
      toast.error('Please upload an Excel spreadsheet (.xlsx, .xls) or .csv file');
      return;
    }

    try {
      setLoading(true);
      setFile(selectedFile);
      const result = await parsePriceListFile(selectedFile, {
        defaultDiscount: discountPercent,
        defaultTurnaround,
        defaultDuration,
      });

      if (result.tests.length === 0) {
        toast.error('No valid test records could be detected in the spreadsheet.');
        return;
      }

      handleParseSuccess(result, selectedFile.name);
    } catch (err: any) {
      console.error('Failed to parse Excel file:', err);
      toast.error(err.message || 'Error parsing Excel file. Please check file format.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Load bundled IQDx Price list
  const handleLoadIQDxSample = async () => {
    try {
      setLoading(true);
      const result = await loadBundledIQDxPriceList({
        defaultDiscount: discountPercent,
        defaultTurnaround,
        defaultDuration,
      });
      handleParseSuccess(result, 'IQDx PRICE LIST H(2026-27).xlsx');
    } catch (err: any) {
      console.error('Failed to load sample IQDx price list:', err);
      toast.error('Could not load sample file: ' + (err.message || 'File missing'));
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Selection toggles
  const handleToggleSelectAll = (checked: boolean) => {
    setTests((prev) => prev.map((t) => ({ ...t, selected: checked })));
  };

  const handleToggleTest = (indexInFiltered: number) => {
    const targetTest = filteredTests[indexInFiltered];
    setTests((prev) =>
      prev.map((t) => (t.name === targetTest.name ? { ...t, selected: !t.selected } : t))
    );
  };

  // Filtered tests computation
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSearch =
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.code && t.code.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept = selectedDept === 'ALL' || t.category === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [tests, searchQuery, selectedDept]);

  const selectedCount = tests.filter((t) => t.selected).length;

  // Pagination slice
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [filteredTests, currentPage]);

  const totalPages = Math.ceil(filteredTests.length / pageSize) || 1;

  // Start upload execution
  const handleStartImport = async () => {
    const selectedTests = tests.filter((t) => t.selected);
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test to import.');
      return;
    }

    if (!labId) {
      toast.error('No Laboratory selected. Please go back to lab details.');
      return;
    }

    setStep('importing');
    setUploadProgress({
      phase: 'syncing_catalog',
      current: 0,
      total: selectedTests.length,
      percentage: 2,
      message: 'Preparing test payload...',
    });

    try {
      const testsToUpload = selectedTests.map((t) => ({
        name: t.name,
        category: t.category,
        sampleType: t.sampleType,
        description: t.description,
        rate: t.rate,
        discountPercent: discountPercent,
        turnaroundTime: defaultTurnaround,
        duration: defaultDuration,
      }));

      const res = await labOwnerAPI.bulkUploadTests(
        labId,
        testsToUpload,
        { updateExisting },
        (progress) => {
          setUploadProgress(progress);
        }
      );

      setUploadStats(res);
      setStep('completed');
      toast.success(
        `Successfully imported ${res.addedToLab} tests into ${labName}!`
      );
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Bulk upload failed:', err);
      toast.error(err.message || 'Failed to complete upload. Please check network/login.');
      setStep('preview');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem] border border-slate-200/80 shadow-2xl bg-white">
        {/* Header */}
        <DialogHeader className="px-8 pt-7 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center shadow-sm">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  Excel Price List Import
                  <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200 text-xs">
                    Bulk Upload
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-sm mt-0.5">
                  Import tests, codes, and prices into <span className="font-semibold text-slate-800">{labName}</span>
                </DialogDescription>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
              <span
                className={`px-3 py-1 rounded-full ${
                  step === 'upload'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                1. Select File
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span
                className={`px-3 py-1 rounded-full ${
                  step === 'preview'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : step === 'importing' || step === 'completed'
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                2. Preview & Settings
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span
                className={`px-3 py-1 rounded-full ${
                  step === 'importing' || step === 'completed'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                3. Import
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                  isDragOver
                    ? 'border-teal-500 bg-teal-50/60 scale-[1.01]'
                    : 'border-slate-300 bg-slate-50/60 hover:border-teal-400 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />

                <div className="w-20 h-20 rounded-3xl bg-white shadow-md border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {loading ? (
                    <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                  ) : (
                    <UploadCloud className="w-10 h-10 text-teal-600" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Drag & Drop your Excel Price List here
                </h3>
                <p className="text-sm text-slate-500 max-w-md mb-4">
                  Upload an Excel workbook (<span className="font-semibold text-slate-700">.xlsx, .xls</span>) or CSV file.
                  Columns like <span className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">Test Name</span>, <span className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">Rate</span>, and <span className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">Dept</span> are automatically detected.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 font-bold px-6 shadow-sm"
                  disabled={loading}
                >
                  Browse Files
                </Button>
              </div>

              {/* 1-Click IQDx Load Card & Template Download */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1-Click IQDx Load Card */}
                <div className="p-5 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-600 text-white">
                        <Sparkles className="w-3.5 h-3.5" /> 1-Click Ready
                      </span>
                      <span className="text-xs font-bold text-teal-800">807 Tests</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">IQDx PRICE LIST (2026-27)</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Directly import the official IQ Diagnostics price list covering Biochemistry, Hematology, Microbiology, Biopsies, and Special Categories.
                    </p>
                  </div>
                  <Button
                    onClick={handleLoadIQDxSample}
                    disabled={loading}
                    className="mt-4 w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold gap-2 shadow-md shadow-teal-600/20"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FlaskConical className="w-4 h-4" />
                    )}
                    Load IQDx Price List (807 Tests)
                  </Button>
                </div>

                {/* Download Template Card */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Database className="w-3.5 h-3.5" /> Template
                      </span>
                      <span className="text-xs text-slate-400">Excel .xlsx</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">Sample Price List Template</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Download our pre-formatted Excel template with headers matching the standard lab schema to fill in your own test prices.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={downloadSamplePriceListTemplate}
                    className="mt-4 w-full rounded-xl border-slate-300 font-bold gap-2 hover:bg-slate-50 text-slate-700"
                  >
                    <Download className="w-4 h-4" /> Download Sample Template
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW & CONFIGURE */}
          {step === 'preview' && parseResult && (
            <div className="space-y-6">
              {/* Summary KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100">
                  <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Total Tests</p>
                  <p className="text-2xl font-extrabold text-teal-900 mt-0.5">{parseResult.stats.totalTests}</p>
                  <p className="text-[11px] text-teal-600 mt-0.5">{selectedCount} selected for import</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Departments</p>
                  <p className="text-2xl font-extrabold text-blue-900 mt-0.5">{parseResult.departments.length}</p>
                  <p className="text-[11px] text-blue-600 mt-0.5">Biochem, Hematology, etc.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Price Range</p>
                  <p className="text-xl font-extrabold text-amber-900 mt-0.5">
                    ₹{parseResult.stats.minRate} - ₹{parseResult.stats.maxRate.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-amber-600 mt-0.5">Avg: ₹{parseResult.stats.avgRate}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Duplicates</p>
                  <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{parseResult.duplicatesCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Consolidated automatically</p>
                </div>
              </div>

              {/* Global Settings Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Turnaround Time
                    </label>
                    <select
                      value={defaultTurnaround}
                      onChange={(e) => setDefaultTurnaround(e.target.value)}
                      className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 font-medium text-slate-800"
                    >
                      <option value="6 hours">6 hours (Express)</option>
                      <option value="12 hours">12 hours (Same Day)</option>
                      <option value="24 hours">24 hours (1 Day)</option>
                      <option value="48 hours">48 hours (2 Days)</option>
                      <option value="72 hours">72 hours (3 Days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Global Discount %
                    </label>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        min="0"
                        max="90"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Math.max(0, Math.min(90, Number(e.target.value) || 0)))}
                        className="w-16 h-8 text-xs font-bold rounded-lg"
                      />
                      <span className="text-slate-500 font-semibold">% off</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="updateExisting"
                      checked={updateExisting}
                      onChange={(e) => setUpdateExisting(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="updateExisting" className="text-slate-700 font-medium cursor-pointer">
                      Update price for tests that already exist in this lab
                    </label>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('upload')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-upload file
                </Button>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search test name or code..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 h-9 rounded-xl text-xs bg-white border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={selectedDept}
                      onChange={(e) => {
                        setSelectedDept(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800"
                    >
                      <option value="ALL">All Departments ({parseResult.departments.length})</option>
                      {parseResult.departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleSelectAll(selectedCount !== tests.length)}
                    className="text-xs font-semibold h-9 rounded-xl"
                  >
                    {selectedCount === tests.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              {/* Tests Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCount === tests.length && tests.length > 0}
                            onChange={(e) => handleToggleSelectAll(e.target.checked)}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                        </th>
                        <th className="py-3 px-3 w-20">Code</th>
                        <th className="py-3 px-4">Test Name</th>
                        <th className="py-3 px-3">Department</th>
                        <th className="py-3 px-3">Sample</th>
                        <th className="py-3 px-3 text-right">Standard Rate</th>
                        {discountPercent > 0 && <th className="py-3 px-3 text-right">Discounted</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedTests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                            No tests match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedTests.map((t, idx) => {
                          const discounted =
                            discountPercent > 0
                              ? Math.round(t.rate * (1 - discountPercent / 100))
                              : t.rate;

                          return (
                            <tr
                              key={`${t.name}-${idx}`}
                              className={`hover:bg-teal-50/40 transition-colors ${
                                !t.selected ? 'opacity-40 bg-slate-50/50' : ''
                              }`}
                            >
                              <td className="py-2.5 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!t.selected}
                                  onChange={() => handleToggleTest((currentPage - 1) * pageSize + idx)}
                                  className="rounded text-teal-600 focus:ring-teal-500"
                                />
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                {t.code || '—'}
                              </td>
                              <td className="py-2.5 px-4 font-semibold text-slate-900 max-w-[280px] truncate">
                                {t.name}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                                  {t.category}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                                  <Droplet className="w-3 h-3 text-teal-600" />
                                  {t.sampleType}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                                ₹{t.rate.toLocaleString()}
                              </td>
                              {discountPercent > 0 && (
                                <td className="py-2.5 px-3 text-right font-bold text-teal-700">
                                  ₹{discounted.toLocaleString()}
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-500">
                  <span>
                    Showing {(currentPage - 1) * pageSize + 1} -{' '}
                    {Math.min(currentPage * pageSize, filteredTests.length)} of {filteredTests.length} tests
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="h-7 px-2.5 text-xs rounded-lg"
                    >
                      Previous
                    </Button>
                    <span className="px-2 font-bold text-slate-700">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="h-7 px-2.5 text-xs rounded-lg"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: IMPORTING PROGRESS */}
          {step === 'importing' && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-teal-50 border-4 border-teal-100 flex items-center justify-center">
                  <FlaskConical className="w-12 h-12 text-teal-600 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Importing Tests into {labName}
                </h3>
                <p className="text-sm text-slate-500">{uploadProgress.message}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-lg space-y-2">
                <Progress value={uploadProgress.percentage} className="h-3 rounded-full bg-slate-100" />
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>{uploadProgress.phase === 'syncing_catalog' ? 'Phase 1: Catalog Sync' : 'Phase 2: Menu Activation'}</span>
                  <span>{uploadProgress.percentage}%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800 max-w-md flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Please do not close this window while bulk database transactions are being processed.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETED */}
          {step === 'completed' && uploadStats && (
            <div className="py-8 px-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="max-w-md space-y-1">
                <h3 className="text-3xl font-extrabold text-slate-900">Import Successful!</h3>
                <p className="text-sm text-slate-500">
                  Your laboratory's diagnostic menu and pricing have been updated.
                </p>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Activated</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{uploadStats.addedToLab}</p>
                  <p className="text-[11px] text-slate-400">In this lab</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cataloged</p>
                  <p className="text-2xl font-black text-teal-600 mt-1">{uploadStats.addedToCatalog}</p>
                  <p className="text-[11px] text-slate-400">New global tests</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Updated</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">{uploadStats.updatedInLab}</p>
                  <p className="text-[11px] text-slate-400">Existing prices</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleClose}
                  className="rounded-xl px-8 h-11 bg-teal-600 hover:bg-teal-700 font-bold text-white shadow-lg shadow-teal-600/20"
                >
                  View Test Menu
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep('upload')}
                  className="rounded-xl px-6 h-11 border-slate-200 font-bold text-slate-700"
                >
                  Upload Another File
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions for step 2 (preview) */}
        {step === 'preview' && (
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep('upload')}
              className="rounded-xl font-semibold gap-1.5 text-slate-600"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Upload
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Ready to import <span className="text-teal-700 font-bold">{selectedCount}</span> tests
              </span>
              <Button
                onClick={handleStartImport}
                disabled={selectedCount === 0}
                className="rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-white shadow-lg shadow-teal-600/20 gap-2 px-6"
              >
                Import Tests to Lab <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExcelUploadModal;
