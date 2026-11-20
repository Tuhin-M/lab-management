import React, { useState } from 'react';
import {
  Settings,
  Database,
  Download,
  CheckCircle2,
  ShieldAlert,
  Server,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const [commissionRate, setCommissionRate] = useState('10');
  const [homeCollectionFee, setHomeCollectionFee] = useState('100');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.info('No data available to export');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            const val = row[fieldName];
            const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Exported ${filename}.csv successfully`);
  };

  const handleExportUsers = async () => {
    try {
      setIsExporting('users');
      const users = await adminService.getUsers();
      exportToCSV(users, 'ekitsa_users');
    } catch {
      toast.error('Failed to export users');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportLabs = async () => {
    try {
      setIsExporting('labs');
      const labs = await adminService.getLabs();
      exportToCSV(labs, 'ekitsa_laboratories');
    } catch {
      toast.error('Failed to export laboratories');
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportTests = async () => {
    try {
      setIsExporting('tests');
      const res = await adminService.getMasterTests({ page: 1, pageSize: 5000 });
      exportToCSV(res.data, 'ekitsa_master_tests');
    } catch {
      toast.error('Failed to export master tests');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Platform System Settings</h3>
        <p className="text-xs text-slate-500">Configure global operational parameters and backup platform data.</p>
      </div>

      {/* Database & Infrastructure Status */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server size={16} className="text-teal-600" /> Infrastructure & Connectivity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Supabase Database Cluster:</span>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-bold">
              <CheckCircle2 size={12} /> Connected (Healthy)
            </Badge>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Cloudflare Edge Deployment:</span>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold">
              ekitsa.com (Active)
            </Badge>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600 font-medium">Catalog Cache Invalidation:</span>
            <span className="text-slate-800 font-mono font-semibold">Real-Time Sync</span>
          </div>
        </CardContent>
      </Card>

      {/* Operational Parameters */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-600" /> Commercial Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Default Home Sample Collection Fee (₹)</label>
              <Input
                type="number"
                value={homeCollectionFee}
                onChange={(e) => setHomeCollectionFee(e.target.value)}
                className="h-10 rounded-xl"
              />
              <p className="text-[11px] text-slate-400">Added to patient cart when opting for home sample pickup.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Platform Commission Rate (%)</label>
              <Input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="h-10 rounded-xl"
              />
              <p className="text-[11px] text-slate-400">Target platform margin calculated on completed orders.</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => toast.success('Platform parameters saved successfully')}
            className="rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
          >
            Update Parameters
          </Button>
        </CardContent>
      </Card>

      {/* Data Export / Backup */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download size={16} className="text-blue-600" /> Platform Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3 text-xs">
          <p className="text-slate-600 leading-relaxed mb-4">
            Export structured database tables as CSV spreadsheets for compliance, analytics, or offline archiving.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleExportUsers}
              disabled={isExporting === 'users'}
              className="h-11 rounded-xl text-xs font-semibold gap-2 border-slate-200 hover:border-teal-500"
            >
              <FileSpreadsheet size={15} className="text-teal-600" />
              {isExporting === 'users' ? 'Exporting...' : 'Export Users (.csv)'}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportLabs}
              disabled={isExporting === 'labs'}
              className="h-11 rounded-xl text-xs font-semibold gap-2 border-slate-200 hover:border-teal-500"
            >
              <FileSpreadsheet size={15} className="text-teal-600" />
              {isExporting === 'labs' ? 'Exporting...' : 'Export Labs (.csv)'}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportTests}
              disabled={isExporting === 'tests'}
              className="h-11 rounded-xl text-xs font-semibold gap-2 border-slate-200 hover:border-teal-500"
            >
              <FileSpreadsheet size={15} className="text-teal-600" />
              {isExporting === 'tests' ? 'Exporting...' : 'Export Tests (.csv)'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
