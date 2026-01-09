const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult, param } = require('express-validator');

// ============================================
// PAYMENT ROUTES
// ============================================

// POST /api/payments/create-order - Create a payment order
router.post('/create-order', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('testBookingId').optional().isUUID(),
  body('appointmentId').optional().isUUID(),
  body('paymentMethod').isIn(['UPI', 'CARD', 'NET_BANKING', 'COD', 'WALLET']),
  body('couponCode').optional().trim()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      amount, 
      testBookingId, 
      appointmentId, 
      paymentMethod, 
      couponCode,
      userId // TODO: Get from auth middleware
    } = req.body;

    // Validate that either testBookingId or appointmentId is provided
    if (!testBookingId && !appointmentId) {
      return res.status(400).json({ error: 'Either testBookingId or appointmentId is required' });
    }

    let discountAmount = 0;
    let appliedCoupon = null;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() }
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (now >= coupon.validFrom && now <= coupon.validUntil) {
          if (amount >= coupon.minOrderValue) {
            if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
              if (coupon.discountType === 'PERCENTAGE') {
                discountAmount = (amount * coupon.discountValue) / 100;
                if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                  discountAmount = coupon.maxDiscount;
                }
              } else {
                discountAmount = coupon.discountValue;
              }
              discountAmount = Math.min(discountAmount, amount);
              appliedCoupon = coupon;
            }
          }
        }
      }
    }

    // Calculate tax (GST 18% for healthcare services in India)
    const taxRate = 0.18;
    const taxableAmount = amount - discountAmount;
    const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
    const finalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

    // Create payment transaction record
    const transaction = await prisma.paymentTransaction.create({
      data: {
        testBookingId,
        appointmentId,
        userId: userId || 'guest', // TODO: Get from auth
        amount,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        couponCode: appliedCoupon?.code,
        discountAmount: Math.round(discountAmount * 100) / 100,
        taxAmount,
        finalAmount,
        metadata: {
          appliedCoupon: appliedCoupon ? {
            id: appliedCoupon.id,
            code: appliedCoupon.code,
            discountType: appliedCoupon.discountType,
            discountValue: appliedCoupon.discountValue
          } : null
        }
      }
    });

    // If coupon was applied, increment usage count
    if (appliedCoupon) {
      await prisma.coupon.update({
        where: { id: appliedCoupon.id },
        data: { usedCount: { increment: 1 } }
      });
    }

    // TODO: Integrate with actual payment gateway (Razorpay/Stripe)
    // For now, return mock gateway order ID
    const gatewayOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: { gatewayOrderId }
    });

    res.status(201).json({
      transactionId: transaction.id,
      gatewayOrderId,
      amount,
      discountAmount: transaction.discountAmount,
      taxAmount: transaction.taxAmount,
      finalAmount: transaction.finalAmount,
      paymentMethod,
      status: transaction.paymentStatus,
      breakdown: {
        subtotal: amount,
        discount: transaction.discountAmount,
        taxableAmount: amount - transaction.discountAmount,
        gst: transaction.taxAmount,
        total: transaction.finalAmount
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/verify - Verify payment after gateway callback
router.post('/verify', [
  body('transactionId').isUUID(),
  body('gatewayPaymentId').notEmpty(),
  body('gatewaySignature').optional()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { transactionId, gatewayPaymentId, gatewaySignature } = req.body;

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // TODO: Verify signature with payment gateway
    // For now, simulate successful payment

    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        paymentStatus: 'PAID',
        gatewayPaymentId
      }
    });

    // Update the associated booking/appointment status
    if (transaction.testBookingId) {
      await prisma.testBooking.update({
        where: { id: transaction.testBookingId },
        data: { paymentStatus: 'PAID' }
      });
    }

    if (transaction.appointmentId) {
      await prisma.appointment.update({
        where: { id: transaction.appointmentId },
        data: { paymentStatus: 'PAID' }
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/payments/:id - Get payment details
router.get('/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/:id/refund - Request refund
router.post('/:id/refund', [
  param('id').isUUID(),
  body('reason').trim().notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.paymentStatus !== 'PAID') {
      return res.status(400).json({ error: 'Only paid transactions can be refunded' });
    }

    // TODO: Process refund through payment gateway
    // For now, mark as refunded

    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id },
      data: {
        paymentStatus: 'REFUNDED',
        metadata: {
          ...transaction.metadata,
          refundReason: reason,
          refundedAt: new Date().toISOString()
        }
      }
    });

    // Update the associated booking/appointment status
    if (transaction.testBookingId) {
      await prisma.testBooking.update({
        where: { id: transaction.testBookingId },
        data: { 
          paymentStatus: 'REFUNDED',
          status: 'CANCELLED'
        }
      });
    }

    if (transaction.appointmentId) {
      await prisma.appointment.update({
        where: { id: transaction.appointmentId },
        data: { 
          paymentStatus: 'REFUNDED',
          status: 'CANCELLED'
        }
      });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
