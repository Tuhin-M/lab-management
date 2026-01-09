import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag, Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

interface CouponInputProps {
  orderTotal: number;
  labId?: string;
  testIds?: string[];
  onCouponApplied: (discount: {
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null) => void;
}

interface CouponValidationResponse {
  valid: boolean;
  couponId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CouponInput: React.FC<CouponInputProps> = ({
  orderTotal,
  labId,
  testIds = [],
  onCouponApplied,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResponse | null>(null);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CouponValidationResponse>(
        `${API_URL}/coupons/validate`,
        {
          code: couponCode.toUpperCase(),
          orderTotal,
          labId,
          testIds,
        }
      );

      const data = response.data;
      setAppliedCoupon(data);
      onCouponApplied({
        code: data.code,
        discountAmount: data.discountAmount,
        finalAmount: data.finalAmount,
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to validate coupon';
      setError(message);
      setAppliedCoupon(null);
      onCouponApplied(null);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setError(null);
    onCouponApplied(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Have a coupon?</label>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                You save ₹{appliedCoupon.discountAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeCoupon}
            className="text-green-600 hover:text-green-800"
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="Enter coupon code"
              className="pl-10 uppercase"
              disabled={isLoading}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={validateCoupon}
            disabled={isLoading || !couponCode.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
