import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Trash2,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getReviews();
      setReviews(data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (review: any) => {
    if (!window.confirm('Are you sure you want to delete this patient review?')) return;
    try {
      setDeletingId(review.id);
      await adminService.deleteReview(review.id);
      toast.success('Review removed successfully');
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Reviews & Rating Moderation</h3>
        <p className="text-xs text-slate-500">Monitor and moderate patient reviews and feedback for laboratories.</p>
      </div>

      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-xs">
              <TableHead className="font-bold text-slate-700">Laboratory</TableHead>
              <TableHead className="font-bold text-slate-700">Rating</TableHead>
              <TableHead className="font-bold text-slate-700">Patient Feedback</TableHead>
              <TableHead className="font-bold text-slate-700">Date</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-xs italic">
                  Loading reviews...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-xs italic">
                  No patient reviews recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-teal-600 shrink-0" />
                      <span className="font-bold text-slate-900">{r.labs?.name || 'Laboratory'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                        />
                      ))}
                      <span className="text-slate-700 font-bold ml-1">{r.rating || 5}.0</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-slate-700 font-medium max-w-lg leading-relaxed">{r.text || 'No comment text'}</p>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {r.created_at ? format(new Date(r.created_at), 'dd MMM yyyy') : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(r)}
                      disabled={deletingId === r.id}
                      className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete Review"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
