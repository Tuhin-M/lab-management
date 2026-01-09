const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult, param, query } = require('express-validator');

// ============================================
// COUPON ROUTES
// ============================================

// GET /api/coupons - List all active coupons (public)
router.get('/', async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        validUntil: { gte: new Date() },
        validFrom: { lte: new Date() }
      },
      select: {
        id: true,
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        minOrderValue: true,
        maxDiscount: true,
        validUntil: true
      }
    });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
});

// POST /api/coupons/validate - Validate and calculate discount
router.post('/validate', [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
  body('orderTotal').isFloat({ min: 0 }).withMessage('Order total must be a positive number'),
  body('labId').optional().isUUID(),
  body('testIds').optional().isArray()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, orderTotal, labId, testIds = [] } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    // Validate coupon status
    if (!coupon.isActive) {
      return res.status(400).json({ error: 'This coupon is no longer active' });
    }

    const now = new Date();
    if (now < coupon.validFrom) {
      return res.status(400).json({ error: 'This coupon is not yet valid' });
    }
    if (now > coupon.validUntil) {
      return res.status(400).json({ error: 'This coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'This coupon has reached its usage limit' });
    }

    if (orderTotal < coupon.minOrderValue) {
      return res.status(400).json({ 
        error: `Minimum order value of ₹${coupon.minOrderValue} required` 
      });
    }

    // Check lab applicability
    if (coupon.applicableLabs.length > 0 && labId) {
      if (!coupon.applicableLabs.includes(labId)) {
        return res.status(400).json({ error: 'This coupon is not valid for the selected lab' });
      }
    }

    // Check test applicability
    if (coupon.applicableTests.length > 0 && testIds.length > 0) {
      const hasApplicableTest = testIds.some(id => coupon.applicableTests.includes(id));
      if (!hasApplicableTest) {
        return res.status(400).json({ error: 'This coupon is not valid for the selected tests' });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    res.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round((orderTotal - discountAmount) * 100) / 100
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/coupons - Create new coupon (Admin only)
router.post('/', [
  body('code').trim().notEmpty().toUpperCase(),
  body('discountType').isIn(['PERCENTAGE', 'FIXED']),
  body('discountValue').isFloat({ min: 0 }),
  body('validUntil').isISO8601(),
  body('minOrderValue').optional().isFloat({ min: 0 }),
  body('maxDiscount').optional().isFloat({ min: 0 }),
  body('usageLimit').optional().isInt({ min: 1 }),
  body('description').optional().trim(),
  body('applicableTests').optional().isArray(),
  body('applicableLabs').optional().isArray()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // TODO: Add admin auth middleware
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue = 0,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      applicableTests = [],
      applicableLabs = []
    } = req.body;

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscount,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: new Date(validUntil),
        usageLimit,
        applicableTests,
        applicableLabs
      }
    });

    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
});

// PUT /api/coupons/:id - Update coupon (Admin only)
router.put('/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.usedCount;
    delete updateData.createdAt;

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: updateData
    });

    res.json(coupon);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    next(error);
  }
});

// DELETE /api/coupons/:id - Soft delete (deactivate) coupon
router.delete('/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.coupon.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Coupon deactivated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    next(error);
  }
});

module.exports = router;
